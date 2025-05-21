using Ovi.Task.UI.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using Ovi.Task.Data.DAO;
using Newtonsoft.Json;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiSupplierEquipManPricesController:ApiController
    {
        private RepositorySupplierEquipManPrices repositorySupplierEquipManPrices;

        public ApiSupplierEquipManPricesController()
        {
            repositorySupplierEquipManPrices = new RepositorySupplierEquipManPrices(); ;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "SMP_ID");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSUPPLIEREQUIPMANPRICES>.Count(gridRequest)
                    : repositorySupplierEquipManPrices.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierEquipManPricesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(TMSUPPLIEREQUIPMANPRICES nSupplierEquipManPrices)
        {
            repositorySupplierEquipManPrices.SaveOrUpdate(nSupplierEquipManPrices);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10437", UserManager.Instance.User.Language),
                r = nSupplierEquipManPrices
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var supplierequipmanprices = repositorySupplierEquipManPrices.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = supplierequipmanprices });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierEquipManPricesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositorySupplierEquipManPrices.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10438", UserManager.Instance.User.Language) });
        }



    }
}