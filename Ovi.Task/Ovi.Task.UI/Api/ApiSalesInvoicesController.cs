using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using Ovi.Task.UI.Helper.Integration.Mikro;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiSalesInvoicesController : ApiController
    {
        private RepositorySalesInvoices repositorySalesInvoices;
        private RepositorySalesInvoiceLines repositorySalesInvoiceLines;
        private RepositorySalesInvoiceReturnLines repositorySalesInvoiceReturnLines;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private SalesInvoiceHelper invoiceHelper;

        public ApiSalesInvoicesController()
        {
            repositorySalesInvoices = new RepositorySalesInvoices();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositorySalesInvoiceLines = new RepositorySalesInvoiceLines();
            repositorySalesInvoiceReturnLines = new RepositorySalesInvoiceReturnLines();
            invoiceHelper = new SalesInvoiceHelper();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "SIV_CUSTOMER", "SIV_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSALESINVOICES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySalesInvoices.List(gridRequest);
                        total = RepositoryShared<TMSALESINVOICES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSalesInvoicesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(SalesInvoiceModel mSalesInvoice)
        {
            repositorySalesInvoices.SaveOrUpdate(mSalesInvoice.SalesInvoice);
            repositoryCustomFieldValues.Save("SALESINVOICE", mSalesInvoice.SalesInvoice.SIV_CODE.ToString(), mSalesInvoice.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10425", UserManager.Instance.User.Language),
                r = mSalesInvoice
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveList(TMSALESINVOICES[] mSalesInvoices)
        {
            repositorySalesInvoices.SaveList(mSalesInvoices);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10125", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveProgressPayments(SalesInvoicePsp salesInvoicePsp)
        {

            var salesinvoice = repositorySalesInvoices.Get(salesInvoicePsp.SalesInvoice);
            salesinvoice.SIV_STATUS = "H";
            repositorySalesInvoices.SaveOrUpdate(salesinvoice);

            foreach (var psp in salesInvoicePsp.Items)
            {
                repositorySalesInvoiceLines.SaveOrUpdate(new TMSALESINVOICELINES
                {
                    SIL_PSP = psp.Psp,
                    SIL_SALESINVOICE = salesInvoicePsp.SalesInvoice,
                    SIL_ISRETURNED = '-',
                    SIL_CREATED = DateTime.Now,
                    SIL_CREATEDBY = UserManager.Instance.User.Code
                });
            }

            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10125", UserManager.Instance.User.Language) });
        }


        [HttpPost]
        [Transaction]
        public string RemovePspFromInvoice([FromBody]int progressPayment)
        {
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20056", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var salesinvoice = repositorySalesInvoices.Get(id);
                var sivstatus = new RepositoryStatuses().Get(new TMSTATUSES
                {
                    STA_CODE = salesinvoice.SIV_STATUS,
                    STA_ENTITY = "SALESINVOICE"
                });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = salesinvoice,
                    stat = sivstatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSalesInvoicesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Transfer([FromBody] int id)
        {
            try
            {
                var salesinvoice = repositorySalesInvoices.Get(id);
                var result = invoiceHelper.Transfer(salesinvoice);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = "Transfer başarılı",
                    result = result
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSalesInvoicesController", "Transfer");
                return JsonConvert.SerializeObject(new { status = 500, data = e.Message });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositorySalesInvoices.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10426", UserManager.Instance.User.Language)
            });
        }
    }
}