using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;
using Ovi.Task.UI.Helper.Integration.Mikro;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiInvoiceController : ApiController
    {
        private RepositoryInvoices repositoryInvoices;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private RepositoryTaskActivities repositoryTaskActivities;
        private InvoiceHelper invoiceHelper;

        public ApiInvoiceController()
        {
            repositoryInvoices = new RepositoryInvoices();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryTaskActivities = new RepositoryTaskActivities();
            invoiceHelper = new InvoiceHelper();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, null, "INV_ORG", "INV_SUPPLIER");
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMINVOICES>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryInvoices.List(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListLines(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, "TSA_TSKCUSTOMER", "TSA_TSKORGANIZATION", "TSA_SUPPLIER");
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMINVOICELINESVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryInvoices.ListLines(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "ListLines");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        public string InvoiceLineDeteils(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMINVOICERETURNLINESDETAILSVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryInvoices.InvoiceLineDetails(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "ListLines");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListLineDetails(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSUPPLIERINVOICELINEDETAILSVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryInvoices.ListLineDetails(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "ListLineDetails");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(InvoiceModel mInvoice)
        {
            repositoryInvoices.SaveOrUpdate(mInvoice.Invoice);
            repositoryCustomFieldValues.Save("INVOICE", mInvoice.Invoice.INV_CODE.ToString(), mInvoice.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10408", UserManager.Instance.User.Language),
                r = mInvoice
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveLines(InvoiceLines invoiceLines)
        {
            var invoice = repositoryInvoices.Get(invoiceLines.Invoice);
            invoice.INV_STATUS = "H";
            repositoryInvoices.SaveOrUpdate(invoice);

            foreach (var item in invoiceLines.Lines)
            {
                var activity = repositoryTaskActivities.Get(item);
                if (activity.TSA_INVOICE.HasValue)
                {
                    throw new TmsException(string.Format(MessageHelper.Get("10198", UserManager.Instance.User.Language), (activity.TSA_TASK + "/" + activity.TSA_LINE)));
                }

                activity.TSA_INVOICE = invoice.INV_CODE;
                repositoryTaskActivities.SaveOrUpdate(activity);
            }

            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10408", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var invoice = repositoryInvoices.Get(id);
                var invoicestatus = new RepositoryStatuses().Get(new TMSTATUSES
                {
                    STA_CODE = invoice.INV_STATUS,
                    STA_ENTITY = invoice.INV_STATUSENTITY
                });



                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = invoice,
                    returnInvoices = repositoryInvoices.GetInvoices(invoice.INV_RETURNINVOICE),
                    stat = invoicestatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Transfer([FromBody] long id)
        {
            try
            {
                var invoice = repositoryInvoices.Get(id);
                var result = invoiceHelper.Transfer(invoice);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = "Transfer Başarılı",
                    result = result
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "Transfer");
                return JsonConvert.SerializeObject(new { status = 500, data = e.Message });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryInvoices.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10409", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string RemoveLineFromInvoice([FromBody]long activityid)
        {
            repositoryInvoices.RemoveLineFromInvoice(activityid);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20056", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string ListSPInvoiceAmount(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSPCRNTPSBINVAMNTVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryInvoices.SolutionPartnerCrntPsbInvAmntList(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInvoiceController", "ListSPInvoiceAmount");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}