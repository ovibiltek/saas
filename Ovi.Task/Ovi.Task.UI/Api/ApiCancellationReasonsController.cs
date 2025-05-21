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
    public class ApiCancellationReasonsController : ApiController
    {
        private RepositoryCancellationReasons repositoryCancellationReasons;

        public ApiCancellationReasonsController()
        {
            repositoryCancellationReasons = new RepositoryCancellationReasons();
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
                        data = RepositoryShared<TMCANCELLATIONREASONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryCancellationReasons.List(gridRequest);
                        total = RepositoryShared<TMCANCELLATIONREASONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCancellationReasonsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCANCELLATIONREASONS nCancellationReason)
        {
            repositoryCancellationReasons.SaveOrUpdate(nCancellationReason, nCancellationReason.CNR_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10181", UserManager.Instance.User.Language),
                r = nCancellationReason
            });
        }

        [HttpPost]
        public string Get(TMCANCELLATIONREASONS r)
        {
            try
            {
                var cancellationReason = repositoryCancellationReasons.Get(r);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cancellationReason
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHoldReasonsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TMCANCELLATIONREASONS r)
        {
            repositoryCancellationReasons.DeleteByEntity(r);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10182", UserManager.Instance.User.Language)
            });
        }
    }
}