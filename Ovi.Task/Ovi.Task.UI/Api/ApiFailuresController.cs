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
    public class ApiFailuresController : ApiController
    {
        private RepositoryFailures repositoryFailures;

        public ApiFailuresController()
        {
            repositoryFailures = new RepositoryFailures();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMFAILURES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryFailures.List(gridRequest);
                        total = RepositoryShared<TMFAILURES>.Count(gridRequest);
                        break;
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFailuresController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMFAILURES nFailure)
        {
            repositoryFailures.SaveOrUpdate(nFailure, nFailure.FAL_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10060", UserManager.Instance.User.Language),
                r = nFailure
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var failure = repositoryFailures.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = failure });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFailuresController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryFailures.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10061", UserManager.Instance.User.Language)
            });
        }
    }
}