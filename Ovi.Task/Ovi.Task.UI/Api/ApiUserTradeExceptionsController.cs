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
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiUserTradeExceptionsController : ApiController
    {
        private RepositoryUserTradeExceptions repositoryUserTradeExceptions;

        public ApiUserTradeExceptionsController()
        {
            repositoryUserTradeExceptions = new RepositoryUserTradeExceptions();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMUSERTRADEEXCEPTIONS>.Count(gridRequest)
                    : repositoryUserTradeExceptions.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserTradeExceptionsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUSERTRADEEXCEPTIONS nExc)
        {
            repositoryUserTradeExceptions.SaveOrUpdate(nExc);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10119", UserManager.Instance.User.Language),
                r = nExc
            });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var exc = repositoryUserTradeExceptions.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = exc });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserTradeExceptionsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryUserTradeExceptions.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10120", UserManager.Instance.User.Language)
            });
        }
    }
}