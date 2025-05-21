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
    public class ApiSupplierDocumentsController : ApiController
    {
        private RepositorySupplierDocuments repositorySupplierDocuments;

        public ApiSupplierDocumentsController()
        {
            repositorySupplierDocuments = new RepositorySupplierDocuments();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSUPPLIERDOCUMENTS>.Count(gridRequest)
                    : repositorySupplierDocuments.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierDocumentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSUPPLIERDOCUMENTS nSupplierDocument)
        {
            repositorySupplierDocuments.SaveOrUpdate(nSupplierDocument);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10681", UserManager.Instance.User.Language), r = nSupplierDocument });
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var brand = repositorySupplierDocuments.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = brand });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupplierDocumentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositorySupplierDocuments.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10682", UserManager.Instance.User.Language) });
        }
    }
}