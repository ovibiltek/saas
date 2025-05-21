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
    public class ApiPartTransactionController : ApiController
    {
        private RepositoryPartTransaction repositoryPartTransaction;
        private RepositoryWarehouses repositoryWarehouses;


        public ApiPartTransactionController()
        {
            repositoryPartTransaction = new RepositoryPartTransaction();
            repositoryWarehouses = new RepositoryWarehouses();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PTR_ORGANIZATION");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPARTTRANS>.Count(gridRequest)
                    : repositoryPartTransaction.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartTransactionController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPARTTRANS nPartTrans)
        {
            if (nPartTrans.PTR_STATUS == "WA")
            {
                var warehouse = repositoryWarehouses.Get(nPartTrans.PTR_WAREHOUSE);
                if (warehouse.WAH_WAREHOUSEMANGROUP == "ADMIN")
                {
                    nPartTrans.PTR_STATUS = "APP";
                }
            }
            repositoryPartTransaction.SaveOrUpdate(nPartTrans);
            return JsonConvert.SerializeObject(new { status = 200, r = nPartTrans, data = MessageHelper.Get("10112", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var parttrans = repositoryPartTransaction.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = parttrans });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartTransactionController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPartTransaction.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10113", UserManager.Instance.User.Language)
            });
        }
    }
}