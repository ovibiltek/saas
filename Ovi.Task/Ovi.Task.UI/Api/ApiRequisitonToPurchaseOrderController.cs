using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;
using Ovi.Task.Data.Mapping;
using Org.BouncyCastle.Crypto;
using NPOI.POIFS.Crypt.Dsig;
using Ovi.Task.Data.Entity.Project;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiRequisitonToPurchaseOrderController : ApiController
    {
        private RepositoryRequisitionToPO repositoryRequisitionToPo;
        private RepositoryPurchaseOrderRequisitionLines repositoryPurchaseOrderRequisitionLines;
        private RepositoryPurchaseOrders repositoryPurchaseOrders;
        private RepositoryPurchaseOrderLines repositoryPurchaseOrderLines;

        public class LineDetails
        {
            public int line { get; set; }
            public decimal quantity { get; set; }
            public decimal unitofprice { get; set; }

            public decimal discountrate { get; set; }
        }

        public class ConvertToPOR
        {
            public TMPURCHASEORDERS Record { get; set; }
            public List<LineDetails> Lines { get; set; }
        }

        public ApiRequisitonToPurchaseOrderController()
        {
            repositoryRequisitionToPo = new RepositoryRequisitionToPO();
            repositoryPurchaseOrderRequisitionLines = new RepositoryPurchaseOrderRequisitionLines();
            repositoryPurchaseOrders = new RepositoryPurchaseOrders();
            repositoryPurchaseOrderLines = new RepositoryPurchaseOrderLines();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMREQUISITIONTOPOVIEW>.Count(gridRequest);
                        total = 0;
                        break;
                    default:
                        data = repositoryRequisitionToPo.List(gridRequest);
                        total = RepositoryShared<TMREQUISITIONTOPOVIEW>.Count(gridRequest);
                        break;
                }
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiRequisitonToPurchaseOrderController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Convert(ConvertToPOR convert)
        {
            try
            {
                TMPURCHASEORDERS rPurchaseOrder = repositoryPurchaseOrders.SaveOrUpdate(convert.Record);

                // PURCAHSE ORDER SAVE 
                foreach (var item in convert.Lines)
                {
                    TMPURCHASEORDERREQUISITIONLINES rPurchaseorderrequisitionlines = repositoryPurchaseOrderRequisitionLines.Get(item.line);

                    TMPURCHASEORDERLINES rPurchaseorderlines = new TMPURCHASEORDERLINES()
                    {
                        PRL_PARTID = rPurchaseorderrequisitionlines.PQL_PARTID,
                        PRL_PARTNOTE = rPurchaseorderrequisitionlines.PQL_PARTNOTE,
                        PRL_PORID = rPurchaseOrder.POR_ID,
                        PRL_QUANTITY = item.quantity,
                        PRL_REQUESTEDUOM = rPurchaseorderrequisitionlines.PQL_REQUESTEDUOM,
                        PRL_UOMMULTI = rPurchaseorderrequisitionlines.PQL_UOMMULTI,
                        PRL_REQUESTEDDATE = DateTime.Now,
                        PRL_UNITPRICE = item.unitofprice,
                        PRL_CURRENCY = rPurchaseorderrequisitionlines.PQL_CURRENCY,
                        PRL_EXCHANGERATE = rPurchaseorderrequisitionlines.PQL_EXCHANGERATE,
                        PRL_VATTAX = rPurchaseorderrequisitionlines.PQL_VATTAX,
                        PRL_DISCOUNT = item.discountrate,
                        PRL_TAX2 = rPurchaseorderrequisitionlines.PQL_TAX2,
                        PRL_REQ = rPurchaseorderrequisitionlines.PQL_REQ,
                        PRL_REQLINEID = rPurchaseorderrequisitionlines.PQL_ID,
                        PRL_REQLINE = rPurchaseorderrequisitionlines.PQL_LINE,
                        PRL_TASK = rPurchaseorderrequisitionlines.PQL_TASK,
                        PRL_TASKACTIVITY = rPurchaseorderrequisitionlines.PQL_TASKACTIVITY,
                        PRL_QUOTATION = rPurchaseorderrequisitionlines.PQL_QUOTATION,
                        PRL_CREATED = DateTime.Now,
                        PRL_CREATEDBY = User.Identity.Name
                    };

                    repositoryPurchaseOrderLines.SaveOrUpdate(rPurchaseorderlines);
                }
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = string.Format(MessageHelper.Get("10461", UserManager.Instance.User.Language), rPurchaseOrder.POR_ID),
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiRequisitonToPurchaseOrderController", "Convert");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}