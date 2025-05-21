using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTaskClosingCodesController : ApiController
    {
        private RepositoryTaskClosingCodes repositoryTaskClosingCodes;

        public ApiTaskClosingCodesController()
        {
            repositoryTaskClosingCodes = new RepositoryTaskClosingCodes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMTASKCLOSINGCODES>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryTaskClosingCodes.List(gridRequest);
                    total = RepositoryShared<TMTASKCLOSINGCODES>.Count(gridRequest);
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskClosingCodesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTASKCLOSINGCODES nTaskClosingCode)
        {
            repositoryTaskClosingCodes.SaveOrUpdate(nTaskClosingCode);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10066", UserManager.Instance.User.Language),
                r = nTaskClosingCode
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var taskclosingcodes = repositoryTaskClosingCodes.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = taskclosingcodes
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskClosingCodesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryTaskClosingCodes.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10067", UserManager.Instance.User.Language)
            });
        }
    }
}