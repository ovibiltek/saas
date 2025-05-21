using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using Resources.PurchaseOrders.Index;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiWarehouseTransfersController : ApiController
    {
        private RepositoryWarehouseTransfers repositoryWarehouseTransfers;

        public ApiWarehouseTransfersController()
        {
            repositoryWarehouseTransfers = new RepositoryWarehouseTransfers();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMWAREHOUSETRANSFERS>.Count(gridRequest);
                var data = repositoryWarehouseTransfers.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data, total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseTransfersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMWAREHOUSETRANSFERS nWarehouseTransfers)
        {
            try
            {
                var oTrans = nWarehouseTransfers.WTR_ID == 0 ? null : repositoryWarehouseTransfers.Get(nWarehouseTransfers.WTR_ID);
                if (oTrans != null)
                {
                    if (oTrans.WTR_STATUS != nWarehouseTransfers.WTR_STATUS && nWarehouseTransfers.WTR_STATUS == "K")
                    {

                        RepositoryWarehouseTransferLines repositoryWarehouseTransferLines = new RepositoryWarehouseTransferLines();
                        var lines = repositoryWarehouseTransferLines.GetLinesByTransferID(nWarehouseTransfers.WTR_ID);
                        if (lines.Count > 0)
                        {
                            TMPARTTRANS transactionForTake = new TMPARTTRANS();
                            transactionForTake.PTR_ID = 0;
                            transactionForTake.PTR_DESCRIPTION = nWarehouseTransfers.WTR_DESCRIPTION;
                            transactionForTake.PTR_TYPE = "ST";
                            transactionForTake.PTR_ORGANIZATION = nWarehouseTransfers.WTR_ORG;
                            transactionForTake.PTR_TRANSACTIONDATE = DateTime.Now;
                            transactionForTake.PTR_WAREHOUSE = nWarehouseTransfers.WTR_FROM;
                            transactionForTake.PTR_STATUS = "N";
                            transactionForTake.PTR_CREATED = DateTime.Now;
                            transactionForTake.PTR_CREATEDBY = UserManager.Instance.User.Code;
                            transactionForTake.PTR_RECORDVERSION = 0;

                            TMPARTTRANS transactionForRecieve = new TMPARTTRANS();
                            transactionForRecieve.PTR_ID = 0;
                            transactionForRecieve.PTR_DESCRIPTION = nWarehouseTransfers.WTR_DESCRIPTION;
                            transactionForRecieve.PTR_TYPE = "R";
                            transactionForRecieve.PTR_ORGANIZATION = nWarehouseTransfers.WTR_ORG;
                            transactionForRecieve.PTR_TRANSACTIONDATE = DateTime.Now;
                            transactionForRecieve.PTR_WAREHOUSE = nWarehouseTransfers.WTR_TO;
                            transactionForRecieve.PTR_STATUS = "N";
                            transactionForRecieve.PTR_CREATED = DateTime.Now;
                            transactionForRecieve.PTR_CREATEDBY = UserManager.Instance.User.Code;
                            transactionForRecieve.PTR_RECORDVERSION = 0;

                            List<TMPARTTRANLINES> partTransLinesForTake = new List<TMPARTTRANLINES>();
                            List<TMPARTTRANLINES> partTransLinesForRecieve = new List<TMPARTTRANLINES>();
                            foreach (var line in lines)
                            {
                                TMPARTTRANLINES partTransLineForTake = new TMPARTTRANLINES();
                                TMPARTTRANLINES partTransLineForRecieve = new TMPARTTRANLINES();
                                //Take
                                partTransLineForTake.PTL_ID = 0;
                                partTransLineForTake.PTL_LINE = line.WTL_LINE;
                                partTransLineForTake.PTL_TRANSACTIONDATE = DateTime.Now;
                                partTransLineForTake.PTL_PART = line.WTL_PART;
                                partTransLineForTake.PTL_TYPE = "ST";
                                partTransLineForTake.PTL_WAREHOUSE = nWarehouseTransfers.WTR_FROM;
                                partTransLineForTake.PTL_BIN = nWarehouseTransfers.WTR_FROMBIN;
                                partTransLineForTake.PTL_QTY = line.WTL_QTY;
                                partTransLineForTake.PTL_PRICE = line.WTL_UNITPRICE; //Exhange rate eklenecek?
                                partTransLineForTake.PTL_CREATED = DateTime.Now;
                                partTransLineForTake.PTL_CREATEDBY = UserManager.Instance.User.Code;
                                //Recieve
                                partTransLineForRecieve.PTL_ID = 0;
                                partTransLineForRecieve.PTL_LINE = line.WTL_LINE;
                                partTransLineForRecieve.PTL_TRANSACTIONDATE = DateTime.Now;
                                partTransLineForRecieve.PTL_PART = line.WTL_PART;
                                partTransLineForRecieve.PTL_TYPE = "R";
                                partTransLineForRecieve.PTL_WAREHOUSE = nWarehouseTransfers.WTR_TO;
                                partTransLineForRecieve.PTL_BIN = nWarehouseTransfers.WTR_TOBIN;
                                partTransLineForRecieve.PTL_QTY = line.WTL_QTY;
                                partTransLineForRecieve.PTL_PRICE = line.WTL_UNITPRICE; //Exhange rate eklenecek?
                                partTransLineForRecieve.PTL_CREATED = DateTime.Now;
                                partTransLineForRecieve.PTL_CREATEDBY = UserManager.Instance.User.Code;
                                //List
                                partTransLinesForTake.Add(partTransLineForTake);
                                partTransLinesForRecieve.Add(partTransLineForRecieve);

                            }
                            RepositoryPartTransaction repositoryPartTransaction = new RepositoryPartTransaction();
                            RepositoryPartTransactionLine repositoryPartTransactionLine = new RepositoryPartTransactionLine();
                            if (repositoryPartTransaction.SaveOrUpdate(transactionForTake) != null)
                            {
                                foreach (var line in partTransLinesForTake)
                                {
                                    line.PTL_TRANSACTION = transactionForTake.PTR_ID;
                                    repositoryPartTransactionLine.SaveOrUpdate(line);
                                }

                                transactionForTake.PTR_STATUS = "APP";
                                transactionForTake.PTR_UPDATED = transactionForTake.PTR_CREATED;
                                transactionForTake.PTR_UPDATEDBY = transactionForTake.PTR_CREATEDBY;
                                repositoryPartTransaction.SaveOrUpdate(transactionForTake);
                            }


                            if (repositoryPartTransaction.SaveOrUpdate(transactionForRecieve) != null)
                            {
                                foreach (var line in partTransLinesForRecieve)
                                {
                                    line.PTL_TRANSACTION = transactionForRecieve.PTR_ID;
                                    repositoryPartTransactionLine.SaveOrUpdate(line);
                                }

                                transactionForRecieve.PTR_STATUS = "APP";
                                transactionForRecieve.PTR_UPDATED = transactionForRecieve.PTR_CREATED;
                                transactionForRecieve.PTR_UPDATEDBY = transactionForRecieve.PTR_CREATEDBY;
                                repositoryPartTransaction.SaveOrUpdate(transactionForRecieve);
                            }


                        }
                        else
                        {
                            
                            return JsonConvert.SerializeObject(new
                            { status = 500,
                              data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language)
                            });

                            //no lines exception
                        }

                    }
                }



               var d =  repositoryWarehouseTransfers.SaveOrUpdate(nWarehouseTransfers);
                var stat = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = d.WTR_STATUS, STA_ENTITY = "WAREHOUSETRANSFER" });
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10177", UserManager.Instance.User.Language),
                    r = d,
                    stat = stat,
                });
            }
            catch (Exception e)
            {

                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseTransfersController", "Save");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
           
        }

       

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var wtw = repositoryWarehouseTransfers.Get(id);
                var stat = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = wtw.WTR_STATUS, STA_ENTITY = "WAREHOUSETRANSFER" });
                return JsonConvert.SerializeObject(new { status = 200, data = wtw, stat = stat });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseTransfersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryWarehouseTransfers.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10178", UserManager.Instance.User.Language) });
        }
    }
}