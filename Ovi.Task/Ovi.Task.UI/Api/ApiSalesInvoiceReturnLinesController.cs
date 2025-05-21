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

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiSalesInvoiceReturnLinesController : ApiController
    {
        private RepositorySalesInvoiceReturnLines repositorySalesInvoiceReturnLines;
        private RepositorySalesInvoices repositorySalesInvoices;
        public class ReturnWithID
        {
            public IList<TMSALESINVOICERETURNLINES> returnlines { get; set; }
            public int salesInvID { get; set; }
        }

        public ApiSalesInvoiceReturnLinesController()
        {
            repositorySalesInvoices = new RepositorySalesInvoices();
            repositorySalesInvoiceReturnLines = new RepositorySalesInvoiceReturnLines();
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
                        data = RepositoryShared<TMSALESINVOICERETURNLINES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySalesInvoiceReturnLines.List(gridRequest);
                        total = RepositoryShared<TMSALESINVOICERETURNLINES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSalesInvoiceReturnLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSALESINVOICERETURNLINES nAction)
        {
            repositorySalesInvoiceReturnLines.SaveOrUpdate(nAction);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10649", UserManager.Instance.User.Language),
                r = nAction
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveReturnList(ReturnWithID nAction)
        {
            foreach (var item in nAction.returnlines)
            {
                repositorySalesInvoiceReturnLines.SaveOrUpdate(item);
            }

            var salesInvoice = repositorySalesInvoices.Get(nAction.salesInvID);
            salesInvoice.SIV_STATUS = "H";
            salesInvoice.SIV_UPDATED = DateTime.Now;
            salesInvoice.SIV_UPDATEDBY = UserManager.Instance.User.Code;
            repositorySalesInvoices.SaveOrUpdate(salesInvoice);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10649", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var action = repositorySalesInvoiceReturnLines.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = action
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSalesInvoiceReturnLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositorySalesInvoiceReturnLines.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10650", UserManager.Instance.User.Language)
            });
        }
    }
}