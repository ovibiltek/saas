using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class ApiToolUsageController : ApiController
    {
        private RepositoryToolUsage repositoryToolUsage;

        public ApiToolUsageController()
        {
            repositoryToolUsage = new RepositoryToolUsage();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMTOOLUSAGE>.Count(gridRequest)
                    : repositoryToolUsage.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiToolUsageController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTOOLUSAGE nToolUsage)
        {
            repositoryToolUsage.SaveOrUpdate(nToolUsage);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10183", UserManager.Instance.User.Language),
                r = nToolUsage
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var toolusage = repositoryToolUsage.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = toolusage });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiToolUsageController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryToolUsage.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10184", UserManager.Instance.User.Language) });
        }
    }
}