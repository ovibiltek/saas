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
    public class ApiEquipmentWarrantyController : ApiController
    {
        private RepositoryEquipmentWarranty repositoryEquipmentWarranty;

        public ApiEquipmentWarrantyController()
        {
            repositoryEquipmentWarranty = new RepositoryEquipmentWarranty();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMEQUIPMENTWARRANTY>.Count(gridRequest)
                    : repositoryEquipmentWarranty.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentWarrantyController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMEQUIPMENTWARRANTY nEquipmentWarranty)
        {
            repositoryEquipmentWarranty.SaveOrUpdate(nEquipmentWarranty);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10684", UserManager.Instance.User.Language),
                r = nEquipmentWarranty
            });
        }

        [HttpPost]
        public string Get([FromBody]int pEquipmentWarranty)
        {
            try
            {
                var equipmentWarranty = repositoryEquipmentWarranty.Get(pEquipmentWarranty);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = equipmentWarranty
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentWarrantyController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int pEquipmentWarranty)
        {
            repositoryEquipmentWarranty.DeleteById(pEquipmentWarranty);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10685", UserManager.Instance.User.Language)
            });
        }
    }
}