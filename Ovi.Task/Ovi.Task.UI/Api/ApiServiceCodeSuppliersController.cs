using System;
using System.Collections.Generic;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiServiceCodeSuppliersController : ApiController
    {
        private RepositoryServiceCodeSuppliers repositoryServiceCodeSuppliers;
        public class DeleteLines
        {
            public List<int> Lines { get; set; }
        }
        public ApiServiceCodeSuppliersController()
        {
            repositoryServiceCodeSuppliers = new RepositoryServiceCodeSuppliers(); ;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSERVICECODESUPPLIERS>.Count(gridRequest)
                    : repositoryServiceCodeSuppliers.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiServiceCodeSuppliersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(TMSERVICECODESUPPLIERS nServiceCodeSuppliers)
        {
           var o = repositoryServiceCodeSuppliers.SaveOrUpdate(nServiceCodeSuppliers, nServiceCodeSuppliers.SRS_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("PRO10015", UserManager.Instance.User.Language),
                r = o
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var ServiceCodeSuppliers = repositoryServiceCodeSuppliers.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = ServiceCodeSuppliers });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiServiceCodeSuppliersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryServiceCodeSuppliers.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("PRO10016", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        [Transaction]
        public string DeleteAll(DeleteLines lines)
        {
            foreach (var item in lines.Lines)
            {
                repositoryServiceCodeSuppliers.DeleteById(item);
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("PRO10016", UserManager.Instance.User.Language) });

        }
    }
}