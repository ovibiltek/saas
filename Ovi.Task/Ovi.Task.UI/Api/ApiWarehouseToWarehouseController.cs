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
    public class ApiWarehouseToWarehouseController : ApiController
    {
        private RepositoryWarehouseToWarehouse repositoryWarehouseToWarehouse;

        public ApiWarehouseToWarehouseController()
        {
            repositoryWarehouseToWarehouse = new RepositoryWarehouseToWarehouse();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMWAREHOUSETOWAREHOUSE>.Count(gridRequest);
                var data = repositoryWarehouseToWarehouse.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data, total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseToWarehouseController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMWAREHOUSETOWAREHOUSE nWarehouseToWarehouse)
        {
            repositoryWarehouseToWarehouse.SaveOrUpdate(nWarehouseToWarehouse);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10177", UserManager.Instance.User.Language),
                r = nWarehouseToWarehouse
            });
        }

        [HttpPost]
        [Transaction]
        public string PerformProcess()
        {
            repositoryWarehouseToWarehouse.PerformProcess();
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20042", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var wtw = repositoryWarehouseToWarehouse.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = wtw });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseToWarehouseController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryWarehouseToWarehouse.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10178", UserManager.Instance.User.Language) });
        }
    }
}