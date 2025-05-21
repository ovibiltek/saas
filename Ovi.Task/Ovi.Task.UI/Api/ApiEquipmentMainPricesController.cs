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
    public class ApiEquipmentMainPricesController:ApiController
    {
        private RepositoryEquipmentMainPrices repositoryEquipmentMainPrices;

        public ApiEquipmentMainPricesController()
        {
            repositoryEquipmentMainPrices = new RepositoryEquipmentMainPrices();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMEQUIPMENTMAINPRICES>.Count(gridRequest)
                    : repositoryEquipmentMainPrices.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentMainPricesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(TMEQUIPMENTMAINPRICES nEquipmentMainPrices)
        {
            repositoryEquipmentMainPrices.SaveOrUpdate(nEquipmentMainPrices);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10205", UserManager.Instance.User.Language),
                r = nEquipmentMainPrices
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var equipmentMainPrices = repositoryEquipmentMainPrices.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = equipmentMainPrices
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEquipmentMainPricesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryEquipmentMainPrices.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10206", UserManager.Instance.User.Language)
            });
        }


    }
}