using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiWarehousesController : ApiController
    {
        private RepositoryWarehouses repositoryWarehouses;

        public class UserWarPar
        {
            public string UserName { get; set; }
            public string Org { get; set; }
        }

        public class WarByActivityPar
        {
            public long Task { get; set; }
            public long Activity { get; set; }
        }

        public ApiWarehousesController()
        {
            repositoryWarehouses = new RepositoryWarehouses();
        }

        private void HideFieldsFromSupplier(TMSTOCKVIEW sv)
        {
            sv.STK_AVGPRICE = 0;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "WAH_ORG");
                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMWAREHOUSES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryWarehouses.List(gridRequest);
                        total = RepositoryShared<TMWAREHOUSES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehousesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMWAREHOUSES nWarehouse)
        {
            repositoryWarehouses.SaveOrUpdate(nWarehouse);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10072", UserManager.Instance.User.Language),
                r = nWarehouse
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var warehouse = repositoryWarehouses.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = warehouse });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehousesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string StockByWarehouse(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                var contractedTaskPart = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "IsContractedTaskPart");
                if (contractedTaskPart != null)
                {
                    contractedTaskPart.Field = null;
                    contractedTaskPart.Logic = "and";
                    contractedTaskPart.Operator = "sqlfunc";
                    contractedTaskPart.Value =
                        string.Format("EXISTS (SELECT 1 FROM dbo.GetContractedPartsForTask({0}) WHERE CPP_PART = STK_PART)",
                            contractedTaskPart.Value);
                }

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSTOCKBYWAREHOUSEVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryWarehouses.StockByWarehouse(gridRequest);
                        total = RepositoryShared<TMSTOCKBYWAREHOUSEVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehousesController", "StockByWarehouse");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string StockView(GridRequest gridRequest)
        {

            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSTOCKVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        var lstOfStock = repositoryWarehouses.StockView(gridRequest);
                        // Hides avg price fields from supplier
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                        {
                            foreach (var trx in lstOfStock)
                                HideFieldsFromSupplier(trx);
                        }
                        data = lstOfStock;
                        total = RepositoryShared<TMSTOCKVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehousesController", "StockView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryWarehouses.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10073", UserManager.Instance.User.Language)
            });
        }


        [HttpPost]
        public string GetWarehousebyWarehouseman([FromBody]UserWarPar par)
        {
            string warehouse = repositoryWarehouses.GetWarehouseByWarehouseman(par.UserName,par.Org);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = warehouse
            });
        }

        [HttpPost]
        public string GetWarehouseByActivity([FromBody] WarByActivityPar par)
        {
            string warehouse = repositoryWarehouses.GetWarehouseByActivity(par.Task, par.Activity);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = warehouse
            });
        }
    }
}