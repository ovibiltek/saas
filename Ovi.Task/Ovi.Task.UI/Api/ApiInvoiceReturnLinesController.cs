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
    public class ApiInvoiceReturnLinesController : ApiController
    {
        private RepositoryInvoiceReturnLines repositoryInvoiceReturnLines;
        private RepositoryInvoices repositoryInvoices;

        public class ReturnWithID
        {
            public IList<TMINVOICERETURNLINES> returnlines { get; set; }
            public int invoiceID { get; set; }
        }
        public ApiInvoiceReturnLinesController()
        {
            repositoryInvoiceReturnLines = new RepositoryInvoiceReturnLines();
            repositoryInvoices = new RepositoryInvoices();
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
                        data = RepositoryShared<TMINVOICERETURNLINES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryInvoiceReturnLines.List(gridRequest);
                        total = RepositoryShared<TMINVOICERETURNLINES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceReturnLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryInvoiceReturnLines.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10654", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMINVOICERETURNLINES mPurchaseOrder)
        {
            repositoryInvoiceReturnLines.SaveOrUpdate(mPurchaseOrder);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10653", UserManager.Instance.User.Language),
                r = mPurchaseOrder
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveReturnList(ReturnWithID nAction)
        {
            foreach (var item in nAction.returnlines)
            {
                repositoryInvoiceReturnLines.SaveOrUpdate(item);
            }

            var invoice = repositoryInvoices.Get(nAction.invoiceID);
            invoice.INV_STATUS = "H";
            invoice.INV_UPDATED = DateTime.Now;
            invoice.INV_UPDATEDBY = UserManager.Instance.User.Code;
            repositoryInvoices.SaveOrUpdate(invoice);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10657", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var purchaseOrder = repositoryInvoiceReturnLines.Get(id);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = purchaseOrder
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceReturnLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}