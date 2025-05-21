using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPurchaseOrdersController : ApiController
    {
        private RepositoryPurchaseOrders repositoryPurchaseOrders;
        private RepositoryPurchaseOrderLines repositoryPurchaseOrderLines;
        private RepositoryPartTransaction repositoryPartTransaction;
        private RepositoryPartTransactionLine repositoryPartTransactionLine;

        public class SaveAll
        {
            public long POS_ID { get; set; }
            public string POS_WAYBILL { get; set; }
        }

        public class POTOWAREHOUSE
        {
            public string ORG { get; set; }
            public string WAREHOUSE { get; set; }

            public List<PurchaseOrderToWarehouseParams> POTOWAREHOUSEPARAMS { get; set; }
        }

        public ApiPurchaseOrdersController()
        {
            repositoryPurchaseOrders = new RepositoryPurchaseOrders();
            repositoryPurchaseOrderLines = new RepositoryPurchaseOrderLines();
            repositoryPartTransaction = new RepositoryPartTransaction();
            repositoryPartTransactionLine = new RepositoryPartTransactionLine();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstPurchaseOrders = repositoryPurchaseOrders.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstPurchaseOrders,
                    total = RepositoryShared<TMPURCHASEORDERS>.Count(gridRequest)
            });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "RepositoryPurchaseOrders", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryPurchaseOrders.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10433", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPURCHASEORDERS mPurchaseOrder)
        {
            repositoryPurchaseOrders.SaveOrUpdate(mPurchaseOrder);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10432", UserManager.Instance.User.Language),
                r = mPurchaseOrder
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var purchaseOrder = repositoryPurchaseOrders.Get(id);
                var purchaseOrderStatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = purchaseOrder.POR_STATUS, STA_ENTITY = "PURCHASEORDER" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = purchaseOrder,
                    stat = purchaseOrderStatus,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "RepositoryPurchaseOrders", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string SavePartTransaction([FromBody]SaveAll model)
        {
            var header = repositoryPurchaseOrders.Get(model.POS_ID);
            GridRequest gridRequest = new GridRequest()
            {
                filter = new GridFilters()
                {
                    Filters = new List<GridFilter>()
                    {
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = header.POR_ID,
                            Operator = "eq",
                            Field = "PRL_PORID"
                        }
                    }
                }
            };
            var lines = repositoryPurchaseOrderLines.List(gridRequest);


            var listOfRemaining = repositoryPurchaseOrderLines.GetRemainingByPO(header.POR_ID);
            var remainingtotal = listOfRemaining.Sum(x => x.PLS_REMAININGQTY);
            if (remainingtotal == 0)
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10436", UserManager.Instance.User.Language) });


            TMPARTTRANS Transaction = new TMPARTTRANS()
            {
                PTR_ID = 0,
                PTR_DESCRIPTION = header.POR_DESCRIPTION,
                PTR_TYPE = "R",
                PTR_ORGANIZATION = header.POR_ORG,
                PTR_TRANSACTIONDATE = DateTime.Now,
                PTR_WAREHOUSE = header.POR_WAREHOUSE,
                PTR_STATUS = "N",
                PTR_INTREF = null,
                PTR_CREATED = DateTime.Now,
                PTR_CREATEDBY = UserManager.Instance.User.Code,
                PTR_UPDATED = null,
                PTR_UPDATEDBY = null,
                PTR_RECORDVERSION = 0
            };

            if (repositoryPartTransaction.SaveOrUpdate(Transaction) != null)
            {
              
                foreach (var item in lines)
                {
                    TMPOLINESUMMARYVIEW mTMPOLINESUMMARYVIEW = new TMPOLINESUMMARYVIEW()
                    {
                        PLS_PORID = item.PRL_PORID,
                        PLS_LINE = item.PRL_LINE
                    };
                    var remaining = repositoryPurchaseOrderLines.GetRemaining(mTMPOLINESUMMARYVIEW);
                    if (remaining.PLS_REMAININGQTY > 0)
                    {
                        TMPARTTRANLINES TransactionLine = new TMPARTTRANLINES()
                        {
                            PTL_ID = 0,
                            PTL_TRANSACTION = Transaction.PTR_ID,
                            PTL_LINE = 10,
                            PTL_TRANSACTIONDATE = DateTime.Now,
                            PTL_PART = item.PRL_PARTID,
                            PTL_TYPE = "R",
                            PTL_TASK = null,
                            PTL_ACTIVITY = null,
                            PTL_PURCHASEORDER = header.POR_ID,
                            PTL_PURCHASEORDERLINE = item.PRL_LINE,
                            PTL_WAREHOUSE = header.POR_WAREHOUSE,
                            PTL_BIN = "*",
                            PTL_PRICE = (item.PRL_UNITPRICE  / item.PRL_UOMMULTI) * item.PRL_EXCHANGERATE,
                            PTL_QTY = remaining.PLS_REMAININGQTY,
                            PTL_WAYBILL = model.POS_WAYBILL,
                            PTL_CREATED = DateTime.Now,
                            PTL_CREATEDBY = UserManager.Instance.User.Code,
                            PTL_RECORDVERSION = 0
                        };
                        repositoryPartTransactionLine.SaveOrUpdate(TransactionLine);
                    }
                }
            
                Transaction.PTR_STATUS = "APP";
                Transaction.PTR_UPDATED = Transaction.PTR_CREATED;
                Transaction.PTR_UPDATEDBY = Transaction.PTR_CREATEDBY;
                repositoryPartTransaction.SaveOrUpdate(Transaction);
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10118", UserManager.Instance.User.Language) });
        }


        [HttpPost]
        [Transaction]
        public string PurchaseOrderToWarehouse([FromBody]POTOWAREHOUSE purchaseOrderToWarehouse)
        {

            TMPARTTRANS Transaction = new TMPARTTRANS()
            {
                PTR_ID = 0,
                PTR_DESCRIPTION = "Otomatik olarak oluşturulmuştur.",
                PTR_TYPE = "R",
                PTR_ORGANIZATION = purchaseOrderToWarehouse.ORG,
                PTR_TRANSACTIONDATE = DateTime.Now,
                PTR_WAREHOUSE = purchaseOrderToWarehouse.WAREHOUSE,
                PTR_STATUS = "N",
                PTR_INTREF = null,
                PTR_CREATED = DateTime.Now,
                PTR_CREATEDBY = UserManager.Instance.User.Code,
                PTR_UPDATED = null,
                PTR_UPDATEDBY = null,
                PTR_RECORDVERSION = 0
            };

            if (repositoryPartTransaction.SaveOrUpdate(Transaction) != null)
            {
                foreach (var item in purchaseOrderToWarehouse.POTOWAREHOUSEPARAMS)
                {
                    TMPARTTRANLINES TransactionLine = new TMPARTTRANLINES()
                    {
                        PTL_ID = 0,
                        PTL_TRANSACTION = Transaction.PTR_ID,
                        PTL_LINE = 10,
                        PTL_TRANSACTIONDATE = DateTime.Now,
                        PTL_PART = item.PTW_PART,
                        PTL_TYPE = "R",
                        PTL_TASK = null,
                        PTL_ACTIVITY = null,
                        PTL_PURCHASEORDER = item.PTW_PORID,
                        PTL_PURCHASEORDERLINE = item.PTW_LINE,
                        PTL_WAREHOUSE = purchaseOrderToWarehouse.WAREHOUSE,
                        PTL_BIN = "*",
                        PTL_PRICE = (item.PTW_UNITPRICE / item.PTW_UOMMULTI) * item.PTW_EXCH,
                        PTL_QTY = item.PTW_REMAINING,
                        PTL_WAYBILL = item.PTW_WAYBILL,
                        PTL_CREATED = DateTime.Now,
                        PTL_CREATEDBY = UserManager.Instance.User.Code,
                        PTL_RECORDVERSION = 0
                    };
                    repositoryPartTransactionLine.SaveOrUpdate(TransactionLine);
                }
                Transaction.PTR_STATUS = "APP";
                Transaction.PTR_UPDATED = Transaction.PTR_CREATED;
                Transaction.PTR_UPDATEDBY = Transaction.PTR_CREATEDBY;
                repositoryPartTransaction.SaveOrUpdate(Transaction);
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10118", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        [Transaction]
        public string GetTabCounts([FromBody]long id)
        {
            try
            {
                var cntlst = repositoryPurchaseOrders.GetTabCounts(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cntlst
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrdersController", "GetTabCounts");
                return JsonConvert.SerializeObject(new
                {
                    status = 500,
                    data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language)
                });
            }
        }

    }
}