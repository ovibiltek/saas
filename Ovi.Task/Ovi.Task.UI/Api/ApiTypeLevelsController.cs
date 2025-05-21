using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTypeLevelsController : ApiController
    {
        private RepositoryTypeLevels repositoryTypeLevels;

        public ApiTypeLevelsController()
        {
            repositoryTypeLevels = new RepositoryTypeLevels();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstOfDocuments = repositoryTypeLevels.List(gridRequest).OrderBy(x => x.TLV_ID);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstOfDocuments,
                    total = RepositoryShared<TMTYPELEVELS>.Count(gridRequest)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTypeLevels", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]int id)
        {
            if (id != 0)
            {
                repositoryTypeLevels.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10445", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTYPELEVELS nTypeLevel)
        {
            repositoryTypeLevels.SaveOrUpdate(nTypeLevel);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10444", UserManager.Instance.User.Language),
                r = nTypeLevel
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var typeLevels = repositoryTypeLevels.Get(id);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = typeLevels
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTypeLevels", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}