using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Quotation;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using Ovi.Task.UI.Helper.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiQuotationsController : ApiController
    {
        public class QuotationLine
        {
            public string Type { get; set; }
            public long Id { get; set; }
            public decimal? UnitSalesPrice { get; set; }
            public int? SalesDiscount { get; set; }
            public decimal? Exch { get; set; }
            public string Curr { get; set; }
            public decimal? Total { get; set; }
            public int Recordversion { get; set; }
        }

        public class QuoToTask
        {
            public int Task { get; set; }
            public int Activity { get; set; }
            public List<QuoToTaskLine> Lines { get; set; }
        }


        public class QuoToTaskLine
        {
            public int Quotation { get; set; }
            public string Type { get; set; }
            public long LineId { get; set; }
            public decimal Quantity { get; set; }
            public int Line { get; set; }
            public string User { get; set; }
        }

        public class QuoFromSingleScreen
        {
            public int TaskID { get; set; }
            public int Activity { get; set; }
            public IList<TMQUOTATIONMISCCOST> Lines { get; set; }
        }

        private RepositoryQuotations repositoryQuotations;
        private RepositoryQuotationLabor repositoryQuotationLabor;
        private RepositoryTaskActivityServiceCodes repositoryTaskActivityServiceCodes;
        private RepositoryQuotationMiscCost repositoryQuotationMiscCost;
        private RepositoryMiscCosts repositoryMiscCosts;
        private RepositoryDocuments repositoryDocuments;
        private RepositoryTasks repositoryTasks;
        private RepositoryTrades repositoryTrades;
        private RepositoryTaskActivities repositoryTaskActivities;
        private RepositoryCustomers repositoryCustomers;
        private RepositoryOrgs repositoryOrgs;
        private RepositoryParameters repositoryParameters;


        public ApiQuotationsController()
        {
            repositoryQuotations = new RepositoryQuotations();
            repositoryTasks = new RepositoryTasks();
            repositoryTrades = new RepositoryTrades();
            repositoryCustomers = new RepositoryCustomers();
            repositoryTaskActivities = new RepositoryTaskActivities();
            repositoryQuotationLabor = new RepositoryQuotationLabor();
            repositoryTaskActivityServiceCodes = new RepositoryTaskActivityServiceCodes();
            repositoryQuotationMiscCost = new RepositoryQuotationMiscCost();
            repositoryMiscCosts = new RepositoryMiscCosts();
            repositoryDocuments = new RepositoryDocuments();
            repositoryOrgs = new RepositoryOrgs();
            repositoryParameters = new RepositoryParameters();

        }

        private IList<TMQUOTATIONSVIEW> HideFieldValuesFromSupplier(IList<TMQUOTATIONSVIEW> data)
        {
            foreach (var d in data)
            {
                d.QUO_SUPPLIER = null;
                d.QUO_SUPPLIERDESC = null;
                d.QUO_TOTALSALES = null;
                d.QUO_PARTSALES = null;
                d.QUO_SERVICESALES = null;
                d.QUO_PARTPURCHASE_ORGCURR = null;
                d.QUO_SERVICESALES_ORGCURR = null;
                d.QUO_TOTALPURCHASE_ORGCURR = null;
            }
            return data;
        }

        private IList<TMQUOTATIONSVIEW> HideFieldValuesFromCustomer(IList<TMQUOTATIONSVIEW> data)
        {
            foreach (var d in data)
            {
                d.QUO_TOTALPURCHASE = null;
                d.QUO_PARTPURCHASE = null;
                d.QUO_SERVICEPURCHASE = null;
                d.QUO_PARTPURCHASE_ORGCURR = null;
                d.QUO_SERVICEPURCHASE_ORGCURR = null;
                d.QUO_TOTALPURCHASE_ORGCURR = null;
            }
            return data;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, "QUO_CUSTOMER", "QUO_ORGANIZATION", "QUO_SUPPLIER");
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMQUOTATIONSVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryQuotations.ListView(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                        {
                            data = HideFieldValuesFromSupplier((IList<TMQUOTATIONSVIEW>)data);
                        }

                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer))
                        {
                            data = HideFieldValuesFromCustomer((IList<TMQUOTATIONSVIEW>)data);
                        }

                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListLinesView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, null, "QLN_ORGANIZATION", "QLN_SUPPLIER");
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMQUOTATIONLINESVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryQuotations.ListLinesView(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "ListLinesView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListLineDetailsView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, null, "QLN_ORGANIZATION", "QLN_SUPPLIER");
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMQUOTATIONLINEDETAILSVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryQuotations.ListLineDetailsView(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "ListLineDetailsView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListHistoryView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV2(gridRequest, null, "QLN_ORGANIZATION", "QLN_SUPPLIER");
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMQUOTATIONLINEHISTORY>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryQuotations.HistoryLinesView(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "ListLinesView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        private static byte[] ReadFully(Stream input)
        {
            var buffer = new byte[16 * 1024];
            using (var ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }

        private bool GenerateAndSaveDoc(long quoid)
        {
            if (quoid != 0)
            {
                var docName = "TeklifFormu-" + quoid + ".pdf";
                var docs = repositoryDocuments.List("QUOTATION", quoid.ToString()).ToList();
                var doc = docs.FirstOrDefault(x => x.DOC_OFN == docName);
                if (doc != null)
                {
                    repositoryDocuments.DeleteById(doc.DOC_ID);
                    if (!doc.DOC_LINK.HasValue)
                        FileHelper.DeleteFile(doc.DOC_PATH, true);
                }

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                {
                    return false;
                }

                #region generateFile

                var quo = new QUO();

                var reportFile = "\\Reports\\Quotation.rpt";
                var grLines = new GridRequest
                {
                    loadall = true,
                    filter = new GridFilters { Filters = new List<GridFilter>() },
                    sort = new List<GridSort>()
                };

                var quotation = repositoryQuotations.GetView(quoid);

                grLines.filter.Filters.Add(new GridFilter { Field = "QLN_QUOTATION", Operator = "eq", Value = quotation.QUO_ID });
                grLines.filter.Filters.Add(new GridFilter { Field = "QLN_TOTALPRICE", Operator = "neq", Value = 0 });

                grLines.sort.Add(new GridSort { Dir = "ASC", Field = "QLN_NO" });
                var lines = repositoryQuotations.ListLinesView(grLines);

                if (lines.Count == 0)
                {
                    return false;
                }

                var ds = new DataSet("VS");
                ds.Tables.Add(quo.QuotationHeader(quotation));
                ds.Tables.Add(quo.QuotationTo(quotation));
                ds.Tables.Add(quo.QuotationFrom(quotation));
                ds.Tables.Add(quo.QuotationLines(lines, quotation));
                ds.Tables.Add(quo.QuotationDescriptions(quotation));
                ds.Tables.Add(quo.QuotationTotal(lines));

                var rptH = new ReportDocument();
                rptH.Load(HttpContext.Current.Server.MapPath(reportFile));
                rptH.SetDataSource(ds);

                var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                var docArray = ReadFully(stream);

                #endregion

                var newDoc = new TMDOCSMETA()
                {
                    DOC_ID = 0,
                    DOC_OFN = docName,
                    DOC_CONTENTTYPE = "application/pdf",
                    DOC_GUID = UniqueStringId.Generate(),
                    DOC_SUBJECT = "QUOTATION",
                    DOC_TYPE = "TEKLIFFORMU",
                    DOC_SOURCE = quoid.ToString(),
                    DOC_CREATED = DateTime.Now,
                    DOC_CREATEDBY = UserManager.Instance.User.Code,
                    DOC_SIZE = docArray.Length
                };

                repositoryDocuments.SaveOrUpdate(newDoc);

                var filepath = string.Format("{0}\\{1}\\{2}\\{3}", string.Format("TMSCONTENTS_{0}", DateTime.Now.Year.ToString()), "QUOTATION", quoid.ToString(), docName);
                FileHelper.CreateFile(filepath, true, docArray);

            }
            return true;
        }

        [HttpPost]
        [Transaction]
        public string Save(QuotationModel mQuotation)
        {
            TMQUOTATIONS quo = null;
            if (mQuotation.Quotation.QUO_ID != 0)
            {
                quo = repositoryQuotations.Get(mQuotation.Quotation.QUO_ID);
                if (mQuotation.Quotation.QUO_STATUS == "B3" && quo.QUO_STATUS != "B3")
                {
                    GenerateAndSaveDoc(mQuotation.Quotation.QUO_ID);
                }
            }

            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier) && mQuotation.Quotation.QUO_ID != 0)
            {
                mQuotation.Quotation.QUO_SUPPLIER = quo.QUO_SUPPLIER;
            }

            repositoryQuotations.SaveOrUpdate(mQuotation.Quotation);
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("QUOTATION", mQuotation.Quotation.QUO_ID.ToString(), mQuotation.CustomFieldValues);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10404", UserManager.Instance.User.Language),
                r = mQuotation
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveLines(QuotationLine[] quotationLines)
        {
            for (var i = 0; i < quotationLines.Length; i++)
            {
                var qLine = quotationLines[i];
                switch (qLine.Type)
                {
                    case "LABOR":
                        SaveQuotationLabor(qLine);
                        break;
                    case "PART":
                        SaveQuotationPart(qLine);
                        break;
                    case "MISCCOST":
                        SaveQuotationMiscCost(qLine);
                        break;
                }
            }
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10421", UserManager.Instance.User.Language),
            });
        }

        private static void SaveQuotationMiscCost(QuotationLine qLine)
        {
            var repositoryQuotationMiscCost = new RepositoryQuotationMiscCost();
            var quomisccost = repositoryQuotationMiscCost.Get(qLine.Id);
            quomisccost.MSC_UNITSALESPRICE = qLine.UnitSalesPrice;
            quomisccost.MSC_SALESDISCOUNTRATE = qLine.SalesDiscount;
            quomisccost.MSC_SALESDISCOUNTEDUNITPRICE = null;
            if (quomisccost.MSC_UNITSALESPRICE.HasValue && quomisccost.MSC_SALESDISCOUNTRATE.HasValue)
            {
                quomisccost.MSC_SALESDISCOUNTEDUNITPRICE = quomisccost.MSC_UNITSALESPRICE -
                                                           (quomisccost.MSC_UNITSALESPRICE.Value *
                                                            quomisccost.MSC_SALESDISCOUNTRATE / 100);
            }

            quomisccost.MSC_TOTALSALESPRICE = qLine.Total;
            quomisccost.MSC_SALESEXCH = qLine.Exch;
            quomisccost.MSC_SALESPRICECURR = qLine.Curr;
            quomisccost.MSC_RECORDVERSION = qLine.Recordversion;
            repositoryQuotationMiscCost.SaveOrUpdate(quomisccost);
        }

        private static void SaveQuotationPart(QuotationLine qLine)
        {
            var repositoryQuotationPart = new RepositoryQuotationPart();
            var quopart = repositoryQuotationPart.Get(qLine.Id);
            quopart.PAR_UNITSALESPRICE = qLine.UnitSalesPrice;
            quopart.PAR_SALESDISCOUNTRATE = qLine.SalesDiscount;
            quopart.PAR_SALESDISCOUNTEDUNITPRICE = null;
            if (quopart.PAR_UNITSALESPRICE.HasValue && quopart.PAR_SALESDISCOUNTRATE.HasValue)
            {
                quopart.PAR_SALESDISCOUNTEDUNITPRICE = quopart.PAR_UNITSALESPRICE -
                                                       (quopart.PAR_UNITSALESPRICE.Value * quopart.PAR_SALESDISCOUNTRATE / 100);
            }

            quopart.PAR_TOTALSALESPRICE = qLine.Total;
            quopart.PAR_SALESEXCH = qLine.Exch;
            quopart.PAR_SALESPRICECURR = qLine.Curr;
            quopart.PAR_RECORDVERSION = qLine.Recordversion;
            repositoryQuotationPart.SaveOrUpdate(quopart);
        }

        private static void SaveQuotationLabor(QuotationLine qLine)
        {
            var repositoryQuotationLabor = new RepositoryQuotationLabor();
            var quolabor = repositoryQuotationLabor.Get(qLine.Id);
            quolabor.LAB_UNITSALESPRICE = qLine.UnitSalesPrice;
            quolabor.LAB_SALESDISCOUNTRATE = qLine.SalesDiscount;
            quolabor.LAB_SALESDISCOUNTEDUNITPRICE = null;
            if (quolabor.LAB_UNITSALESPRICE.HasValue && quolabor.LAB_SALESDISCOUNTRATE.HasValue)
            {
                quolabor.LAB_SALESDISCOUNTEDUNITPRICE = quolabor.LAB_UNITSALESPRICE - (quolabor.LAB_UNITSALESPRICE.Value * quolabor.LAB_SALESDISCOUNTRATE / 100);
            }

            quolabor.LAB_TOTALSALESPRICE = qLine.Total;
            quolabor.LAB_SALESEXCH = qLine.Exch;
            quolabor.LAB_SALESPRICECURR = qLine.Curr;
            quolabor.LAB_RECORDVERSION = qLine.Recordversion;
            repositoryQuotationLabor.SaveOrUpdate(quolabor);
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var quotation = repositoryQuotations.Get(id);
                var quotationstatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = quotation.QUO_STATUS, STA_ENTITY = "QUOTATION" });
                var mailrecipients = new RepositoryUsers().GetUsers(quotation.QUO_MAILRECIPIENTS);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = quotation,
                    stat = quotationstatus,
                    recipients = mailrecipients
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryQuotations.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10405", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string GetTabCounts([FromBody]long id)
        {
            try
            {
                var cntlst = repositoryQuotations.GetTabCounts(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cntlst
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "GetTabCounts");
                return JsonConvert.SerializeObject(new
                {
                    status = 500,
                    data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language)
                });
            }
        }

        [HttpPost]
        [Transaction]
        public string QuotationToActivity(QuoToTask p)
        {

            var task = repositoryTasks.Get(p.Task);
            var org = repositoryOrgs.Get(task.TSK_ORGANIZATION);
            var noSalesCheck = ConfigHelper.Get("HideSalesSection") == "+";

            foreach (var item in p.Lines)
            {
                if (item.Type == "LABOR")
                {
                    var labor = repositoryQuotationLabor.Get(item.LineId);
                    if (labor.LAB_COPY == '-')
                    {
                        var newservicecode = new TMTASKACTIVITYSERVICECODES
                        {
                            ASR_ID = 0,
                            ASR_ACTIVITY = p.Activity,
                            ASR_SERVICECODE = labor.LAB_SERVICECODE,
                            ASR_QUANTITY = item.Quantity,
                            ASR_UNITPRICE = labor.LAB_PURCHASEDISCOUNTEDUNITPRICE ?? (labor.LAB_UNITPURCHASEPRICE.Value * labor.LAB_PURCHASEEXCH.Value),
                            ASR_UNITSALESPRICE = labor.LAB_SALESDISCOUNTEDUNITPRICE ?? (labor.LAB_UNITSALESPRICE.Value * labor.LAB_SALESEXCH.Value),
                            ASR_ALLOWZERO = '-',
                            ASR_CURRENCY = org.ORG_CURRENCY,
                            ASR_PRICINGMETHOD = "QUOTATION",
                            ASR_EXCH = 1,
                            ASR_CREATED = DateTime.Now,
                            ASR_CREATEDBY = item.User,
                            ASR_UPDATED = null,
                            ASR_UPDATEDBY = null,
                            ASR_RECORDVERSION = 0
                        };

                        repositoryTaskActivityServiceCodes.SaveOrUpdate(newservicecode);
                        labor.LAB_COPY = '+';
                        repositoryQuotationLabor.SaveOrUpdate(labor);
                    }
                }
                else if (item.Type == "MISCCOST")
                {
                    var misccost = repositoryQuotationMiscCost.Get(item.LineId);
                    if (misccost.MSC_COPY == '-')
                    {
                        if (!(misccost.MSC_SERVICECODE.HasValue))
                        {
                            if (misccost.MSC_UNITPURCHASEPRICE != null && (noSalesCheck || misccost.MSC_UNITSALESPRICE != null))
                            {
                                var newmisccost = new TMMISCCOSTS
                                {
                                    MSC_ID = 0,
                                    MSC_TASK = p.Task,
                                    MSC_ACTIVITY = item.Line,
                                    MSC_DATE = DateTime.Today,
                                    MSC_DESC = misccost.MSC_DESC ?? misccost.MSC_PARTDESCRIPTION,
                                    MSC_TYPE = misccost.MSC_TYPE,
                                    MSC_PTYPE = misccost.MSC_PTYPE,
                                    MSC_UNITPRICE = (misccost.MSC_PURCHASEDISCOUNTEDUNITPRICE ?? misccost.MSC_UNITPURCHASEPRICE.Value) * (misccost.MSC_PURCHASEEXCH ?? 1.0m),
                                    MSC_UNITSALESPRICE = noSalesCheck ? 0 : (misccost.MSC_SALESDISCOUNTEDUNITPRICE ?? misccost.MSC_UNITSALESPRICE.Value) * (misccost.MSC_SALESEXCH ?? 1.0m),
                                    MSC_CURR = org.ORG_CURRENCY,
                                    MSC_EXCH = 1.0m,
                                    MSC_QTY = item.Quantity,
                                    MSC_UOM = misccost.MSC_UOM,
                                    MSC_TOTAL = (misccost.MSC_TOTALPURCHASEPRICE ?? 0) * (misccost.MSC_PURCHASEEXCH ?? 1.0m),
                                    MSC_INVOICE = null,
                                    MSC_PART = misccost.MSC_PART != null ? Convert.ToInt32(misccost.MSC_PART.Value) : (int?)null,
                                    MSC_FIXED = '-',
                                    MSC_CREATED = DateTime.Now,
                                    MSC_CREATEDBY = item.User,
                                    MSC_UPDATED = null,
                                    MSC_UPDATEDBY = null,
                                    MSC_RECORDVERSION = 0
                                };
                                repositoryMiscCosts.SaveOrUpdate(newmisccost);
                            }

                            misccost.MSC_COPY = '+';
                            repositoryQuotationMiscCost.SaveOrUpdate(misccost);
                        }
                        else
                        {
                            var newservicecode = new TMTASKACTIVITYSERVICECODES
                            {
                                ASR_ID = 0,
                                ASR_ACTIVITY = p.Activity,
                                ASR_SERVICECODE = misccost.MSC_SERVICECODE.Value,
                                ASR_QUANTITY = item.Quantity,
                                ASR_UNITPRICE = (misccost.MSC_PURCHASEDISCOUNTEDUNITPRICE ?? misccost.MSC_UNITPURCHASEPRICE.Value) * (misccost.MSC_PURCHASEEXCH ?? 1.0m),
                                ASR_UNITSALESPRICE = (misccost.MSC_SALESDISCOUNTEDUNITPRICE ?? misccost.MSC_UNITSALESPRICE.Value) * (misccost.MSC_SALESEXCH ?? 1.0m),
                                ASR_ALLOWZERO = '-',
                                ASR_CURRENCY = org.ORG_CURRENCY,
                                ASR_PRICINGMETHOD = "QUOTATION",
                                ASR_EXCH = 1,
                                ASR_CREATED = DateTime.Now,
                                ASR_CREATEDBY = item.User,
                                ASR_UPDATED = null,
                                ASR_UPDATEDBY = null,
                                ASR_RECORDVERSION = 0
                            };

                            repositoryTaskActivityServiceCodes.SaveOrUpdate(newservicecode);
                            misccost.MSC_COPY = '+';
                            repositoryQuotationMiscCost.SaveOrUpdate(misccost);
                        }
                    }
                }
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10648", UserManager.Instance.User.Language)
            });

        }



        [HttpPost]
        [Transaction]
        public string CreateQuotationFromSingleScreen(QuoFromSingleScreen p)
        {
            var task = repositoryTasks.Get(p.TaskID);
            var trade = repositoryTrades.Get(UserManager.Instance.User.Trade);
            var activity = repositoryTaskActivities.GetByTaskAndLine(p.TaskID, p.Activity);
            var customer = repositoryCustomers.Get(task.TSK_CUSTOMER);
            var defaultQuotationStatus = ConfigHelper.Get("DefaultQuotationStatus");
            var quotationStatusAfterSave = ConfigHelper.Get("QuotationStatusAfterSave");
            var applyQuotationProfitMargin = ConfigHelper.Get("ApplyQuotationProfitMargin");
            var quoProfitMargin = repositoryParameters.Get("QUOPROFITMARGIN");

            if (string.IsNullOrEmpty(trade.TRD_SUPPLIER))
            {
                return JsonConvert.SerializeObject(new
                {
                    status = 500,
                    data = MessageHelper.Get("10658", UserManager.Instance.User.Language),
                });
            }

            var newQuo = new TMQUOTATIONS()
            {
                QUO_ID = 0,
                QUO_ORGANIZATION = task.TSK_ORGANIZATION,
                QUO_DESCRIPTION = activity.TSA_DESC,
                QUO_NOTE = activity.TSA_DESC,
                QUO_TYPE = "ALISSATIS",
                QUO_TYPEENTITY = "QUOTATION",
                QUO_SUPPLIER = trade.TRD_SUPPLIER,
                QUO_STATUS = defaultQuotationStatus == "-" ? "H":  defaultQuotationStatus,
                QUO_STATUSENTITY = "QUOTATION",
                QUO_CUSTOMER = task.TSK_CUSTOMER,
                QUO_TASK = task.TSK_ID,
                QUO_ACTIVITY = p.Activity,
                QUO_CURR = "TL",
                QUO_EXCH = 1,
                QUO_MANAGER = customer.CUS_PMMASTER,
                QUO_CREATED = DateTime.Now,
                QUO_CREATEDBY = UserManager.Instance.User.Code
            };

            var quotation = repositoryQuotations.SaveOrUpdate(newQuo, true);

            foreach (var item in p.Lines)
            {
                item.MSC_QUOTATION = (int)quotation.QUO_ID;

                if (applyQuotationProfitMargin == "+" && quoProfitMargin!=null)
                {
                    if (NumberHelper.ParseDecimal(quoProfitMargin.PRM_VALUE, out var profitMargin))
                    {
                        decimal margin = Math.Round((item.MSC_UNITPURCHASEPRICE * profitMargin / 100).Value, 2);
                        item.MSC_UNITSALESPRICE = item.MSC_UNITPURCHASEPRICE + margin;
                        item.MSC_TOTALSALESPRICE = item.MSC_UNITSALESPRICE * item.MSC_QTY;
                        item.MSC_SALESEXCH = 1;
                        item.MSC_SALESPRICECURR = item.MSC_PURCHASEPRICECURR;
                    }
                }
                repositoryQuotationMiscCost.SaveOrUpdate(item);
            }

            if (quotationStatusAfterSave != "-")
            {
                quotation.QUO_STATUS = "H";
                repositoryQuotations.SaveOrUpdate(quotation, false);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10404", UserManager.Instance.User.Language)
            });

        }
    }
}