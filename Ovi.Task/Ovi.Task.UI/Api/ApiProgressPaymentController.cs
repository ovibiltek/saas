using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Ovi.Task.UI.Models;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiProgressPaymentController : ApiController
    {
        private RepositoryProgressPayments repositoryProgressPayments;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private RepositorySalesInvoices repositorySalesInvoices;
        private RepositorySalesInvoiceLines repositorySalesInvoiceLines;


        public ApiProgressPaymentController()
        {
            repositoryProgressPayments = new RepositoryProgressPayments();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositorySalesInvoices = new RepositorySalesInvoices();
            repositorySalesInvoiceLines = new RepositorySalesInvoiceLines();
        }

        private GridRequest ShayaFilter(GridRequest gridRequest)
        {
            if (gridRequest.filter == null)
                return gridRequest;

            var shayaFilters = gridRequest.filter.Filters.Where(x => x.Field != null && x.Field.ToString().StartsWith("SHAYA"));
            var fieldFilters = shayaFilters as GridFilter[] ?? shayaFilters.ToArray();
            var gridFilters = fieldFilters.Select(x => new GridFilter
            {
                Operator = "sqlfunc",
                Value = "EXISTS (SELECT 1 FROM dbo." + x.Value + " WHERE FIL_PSP = PSP_CODE)",
                Logic = "and"
            });
            gridRequest.filter.Filters = gridRequest.filter.Filters.Except(fieldFilters).ToList();
            gridRequest.filter.Filters.AddRange(gridFilters);
            return gridRequest;
        }

        private IList<TMPROGRESSPAYMENTSVIEW> HideFieldValuesFromCustomer(IList<TMPROGRESSPAYMENTSVIEW> data)
        {
            foreach (var d in data)
            {
                d.PSP_PROFIT = 0;
                d.PSP_COST = 0;
            }
            return data;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(GridRequestHelper.Filter(gridRequest, "PSP_CUSTOMER", "PSP_ORG"));

                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPROGRESSPAYMENTSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProgressPayments.ListView(gridRequest);
                        total = RepositoryShared<TMPROGRESSPAYMENTSVIEW>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer))
                            data = HideFieldValuesFromCustomer((IList<TMPROGRESSPAYMENTSVIEW>)data);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListLinesView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "PPL_CUSTOMER", "PPL_PSPORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPSPLINESVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProgressPayments.ListLinesView(gridRequest);
                        total = RepositoryShared<TMPSPLINESVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentController", "ListLinesView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListInvoiceDetailView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPSPINVOICEDETAILSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProgressPayments.ListInvoiceDetailView(gridRequest);
                        total = RepositoryShared<TMPSPINVOICEDETAILSVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentController", "ListInvoiceDetailView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListAvailableTasks(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                if (UserManager.Instance.User.Customer != null)
                {
                    if (gridRequest.filter == null)
                    {
                        gridRequest.filter = new GridFilters { Filters = new List<GridFilter>() };
                    }

                    gridRequest.filter.Filters.Add(new GridFilter { Field = "WPT_CUSTOMER", Value = UserManager.Instance.User.Customer, Operator = "eq", Logic = "and" });
                }

                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMAVAILABLETASKSFORPSPVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProgressPayments.ListAvailableTasks(gridRequest);
                        total = RepositoryShared<TMAVAILABLETASKSFORPSPVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentController", "ListAvailableTasks");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListSalesInvoiceLines(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "PSP_CUSTOMER", "PSP_ORG");

                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSALESINVOICELINESVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProgressPayments.ListSalesInvoiceLines(gridRequest);
                        total = RepositoryShared<TMSALESINVOICELINESVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentController", "ListSalesInvoiceLines");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(ProgressPaymentModel mProgressPayment)
        {
            repositoryProgressPayments.SaveOrUpdate(mProgressPayment.ProgressPayment);
            repositoryCustomFieldValues.Save("PROGRESSPAYMENT", mProgressPayment.ProgressPayment.PSP_CODE.ToString(), mProgressPayment.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10125", UserManager.Instance.User.Language),
                r = mProgressPayment
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveList(BulkProgressPaymentModel progressPaymentModel)
        {
            var progressPayments = new List<TMPROGRESSPAYMENTS>();

            TMPSPGROUPCODES groupcode = null;
            if (progressPaymentModel.Status == "H2")
            {
                var repositoryProgressPaymentGroupCodes = new RepositoryProgressPaymentGroupCodes();
                groupcode = repositoryProgressPaymentGroupCodes.SaveOrUpdate(new TMPSPGROUPCODES
                {
                    PSG_CREATED = DateTime.Now,
                    PSG_CREATEDBY = UserManager.Instance.User.Code
                });
            }

            foreach (var pspcode in progressPaymentModel.Lines)
            {
                var psp = repositoryProgressPayments.Get(pspcode);
                psp.PSP_UPDATED = DateTime.Now;
                psp.PSP_UPDATEDBY = UserManager.Instance.User.Code;
                psp.PSP_STATUS = progressPaymentModel.Status;
                psp.PSP_ALLOWZEROTOTAL = progressPaymentModel.AllowZeroTotal;
                if (groupcode != null)  psp.PSP_GROUP = groupcode.PSG_ID;

                if (progressPaymentModel.Status == "K2")
                {
                    psp.PSP_INVOICENO = progressPaymentModel.InvoiceNo;
                    psp.PSP_INVOICEDATE = progressPaymentModel.InvoiceDate;
                }

                progressPayments.Add(psp);
            }

            repositoryProgressPayments.SaveList(progressPayments.ToArray());

            CreateInvoice(progressPaymentModel, progressPayments);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10125", UserManager.Instance.User.Language),
            });
        }

        private void CreateInvoice(BulkProgressPaymentModel progressPaymentModel, List<TMPROGRESSPAYMENTS> progressPayments)
        {
            if (progressPaymentModel.InvoiceOption == "BULK")
            {
                #region Branch

                string branch = progressPayments.FirstOrDefault().PSP_BRANCH;
                if (progressPayments.Count > 1)
                {
                    for (int i = 1; i < progressPayments.Count; i++)
                    {
                        if (progressPayments[i-1].PSP_BRANCH != progressPayments[i].PSP_BRANCH)
                        {
                            branch = String.Empty;
                            break;
                        }
                    }
                }
                #endregion

                var salesInvoice = repositorySalesInvoices.SaveOrUpdate(new TMSALESINVOICES
                {
                    SIV_CODE = 0,
                    SIV_DESC = progressPaymentModel.InvoiceDescription,
                    SIV_INVOICENO = progressPaymentModel.InvoiceNo,
                    SIV_INVOICEDATE = progressPaymentModel.InvoiceDate,
                    SIV_INVOICEDESCRIPTION = progressPaymentModel.InvoiceDescription,
                    SIV_PRINTTYPE = progressPaymentModel.PrintType,
                    SIV_ORG = progressPayments.FirstOrDefault().PSP_ORG,
                    SIV_CUSTOMER = progressPayments.FirstOrDefault().PSP_CUSTOMER,
                    SIV_ORDERNO =  progressPaymentModel.OrderNo,
                    SIV_BRANCH = branch,
                    SIV_TYPE = "SATIS",
                    SIV_TYPEENTITY = "SALESINVOICE",
                    SIV_CREATED = DateTime.Now,
                    SIV_CREATEDBY = UserManager.Instance.User.Code,
                    SIV_STATUS = "A",
                    SIV_STATUSENTITY = "SALESINVOICE",
                    SIV_UPDATED = null,
                    SIV_UPDATEDBY = null,
                    SIV_RECORDVERSION = 0
                }, true);


                var salesInvoiceLines = progressPayments.Select(x => new TMSALESINVOICELINES
                {
                    SIL_ID = 0,
                    SIL_SALESINVOICE = salesInvoice.SIV_CODE,
                    SIL_PSP = x.PSP_CODE,
                    SIL_ISRETURNED = '-',
                    SIL_CREATED = DateTime.Now,
                    SIL_CREATEDBY = UserManager.Instance.User.Code,
                    SIL_UPDATED = null,
                    SIL_UPDATEDBY = null,
                    SIL_RECORDVERSION = 0
                }).ToArray();

                repositorySalesInvoiceLines.SaveList(salesInvoiceLines);

                salesInvoice.SIV_STATUS = "H";
                salesInvoice.SIV_UPDATED = null;
                salesInvoice.SIV_UPDATEDBY = null;
                repositorySalesInvoices.SaveOrUpdate(salesInvoice);
            }
            else if (progressPaymentModel.InvoiceOption == "SEPERATE")
            {
                foreach (var pspcode in progressPaymentModel.Lines)
                {
                    var psp = repositoryProgressPayments.Get(pspcode);
                    var salesInvoice = repositorySalesInvoices.SaveOrUpdate(new TMSALESINVOICES
                    {
                        SIV_CODE = 0,
                        SIV_DESC = "Hakediş üzerinden otomatik oluşturulmuştur.",
                        SIV_INVOICENO = progressPaymentModel.InvoiceNo,
                        SIV_INVOICEDATE = progressPaymentModel.InvoiceDate,
                        SIV_INVOICEDESCRIPTION = progressPaymentModel.InvoiceDescription,
                        SIV_PRINTTYPE = progressPaymentModel.PrintType,
                        SIV_ORG = psp.PSP_ORG,
                        SIV_CUSTOMER = psp.PSP_CUSTOMER,
                        SIV_TYPE = "SATIS",
                        SIV_TYPEENTITY = "SALESINVOICE",
                        SIV_CREATED = DateTime.Now,
                        SIV_CREATEDBY = UserManager.Instance.User.Code,
                        SIV_STATUS = "A",
                        SIV_STATUSENTITY = "SALESINVOICE",
                        SIV_UPDATED = null,
                        SIV_UPDATEDBY = null,
                        SIV_RECORDVERSION = 0
                    }, true);

                    repositorySalesInvoiceLines.SaveOrUpdate(new TMSALESINVOICELINES
                    {
                        SIL_ID = 0,
                        SIL_SALESINVOICE = salesInvoice.SIV_CODE,
                        SIL_PSP = psp.PSP_CODE,
                        SIL_ISRETURNED = '-',
                        SIL_CREATED = DateTime.Now,
                        SIL_CREATEDBY = UserManager.Instance.User.Code,
                        SIL_UPDATED = null,
                        SIL_UPDATEDBY = null,
                        SIL_RECORDVERSION = 0
                    });

                    salesInvoice.SIV_STATUS = "H";
                    salesInvoice.SIV_UPDATED = null;
                    salesInvoice.SIV_UPDATEDBY = null;
                    repositorySalesInvoices.SaveOrUpdate(salesInvoice);
                }
            }
        }

        [HttpPost]
        [Transaction]
        public string SaveTasks(ProgressPaymentTask ppt)
        {
            var repositoryProgressPaymentPricing = new RepositoryProgressPaymentPricing();
            var repositoryTasks = new RepositoryTasks();


            foreach (var item in ppt.Items)
            {
                var oTask = repositoryTasks.Get(item.Task);
                if (oTask.TSK_PSPCODE.HasValue)
                {
                    throw new TmsException(string.Format(MessageHelper.Get("10197", UserManager.Instance.User.Language), oTask.TSK_ID));
                }

                var nTask = (TMTASKS)oTask.Clone();
                nTask.TSK_PSPCODE = ppt.Psp;
                nTask.TSK_PRPCODE = item.Prp;
                repositoryTasks.SaveOrUpdate(nTask);
            }

            repositoryProgressPaymentPricing.CreateLines(ppt.Psp);

            var oProgressPayment = repositoryProgressPayments.Get(ppt.Psp);
            var nProgressPayment = (TMPROGRESSPAYMENTS)oProgressPayment.Clone();
            nProgressPayment.PSP_STATUS = "H";
            repositoryProgressPayments.SaveOrUpdate(nProgressPayment);

            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10125", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var progresspayment = repositoryProgressPayments.Get(id);
                var ppstatus = new RepositoryStatuses().Get(new TMSTATUSES
                {
                    STA_CODE = progresspayment.PSP_STATUS,
                    STA_ENTITY = "PROGRESSPAYMENT"
                });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = progresspayment,
                    stat = ppstatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryProgressPayments.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10126", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string RemoveTaskFromPsp([FromBody]long taskid)
        {
            repositoryProgressPayments.RemoveTaskFromPSP(taskid);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20056", UserManager.Instance.User.Language)
            });
        }
    }
}