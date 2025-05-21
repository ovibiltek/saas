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
    public class ApiSupplierVehiclesController : ApiController
    {
        private RepositorySupplierVehicles repositorySupplierVehicles;

        public ApiSupplierVehiclesController()
        {
            repositorySupplierVehicles = new RepositorySupplierVehicles();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSUPPLIERVEHICLES>.Count(gridRequest)
                    : repositorySupplierVehicles.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierVehiclesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSUPPLIERVEHICLES nSupplierVehicles)
        {
            repositorySupplierVehicles.SaveOrUpdate(nSupplierVehicles);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10668", UserManager.Instance.User.Language), r = nSupplierVehicles });
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var suppliervehicle = repositorySupplierVehicles.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = suppliervehicle });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierVehiclesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositorySupplierVehicles.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10669", UserManager.Instance.User.Language) });
        }
    }
}