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
    public class ApiPurchaseOrderDetailsController : ApiController
    {
        private RepositoryPurchaseOrderDetails repositoryPurchaseOrderDetails;

        public ApiPurchaseOrderDetailsController()
        {
            repositoryPurchaseOrderDetails = new RepositoryPurchaseOrderDetails();
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
                        data = RepositoryShared<TMPURCHASEORDERDETAILSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryPurchaseOrderDetails.List(gridRequest);
                        total = RepositoryShared<TMPURCHASEORDERDETAILSVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderDetailsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }



        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var pod = repositoryPurchaseOrderDetails.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pod });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderDetailsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


    }
}