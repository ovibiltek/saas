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
    public class ApiSupplierDeliveryController : ApiController
    {
        private RepositorySupplierDelivery repositorySupplierDelivery;

        public ApiSupplierDeliveryController()
        {
            repositorySupplierDelivery = new RepositorySupplierDelivery();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSUPPLIERDELIVERY>.Count(gridRequest)
                    : repositorySupplierDelivery.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierDeliveryController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSUPPLIERDELIVERY nSupplierDelivery)
        {
            repositorySupplierDelivery.SaveOrUpdate(nSupplierDelivery);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10674", UserManager.Instance.User.Language), r = nSupplierDelivery });
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var supplierdelivery = repositorySupplierDelivery.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = supplierdelivery });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierDeliveryController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositorySupplierDelivery.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10675", UserManager.Instance.User.Language) });
        }
    }
}