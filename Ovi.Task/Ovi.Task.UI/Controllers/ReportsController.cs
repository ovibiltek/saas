using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using Microsoft.SqlServer.Server;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Crypto.Parameters;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Quotation;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Helper;
using Ovi.Task.UI.Helper.Reports;
//using Ovi.Task.UI.Reports.xsd;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using Resources.Projects.Index;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web.Mvc;
using CBS = Ovi.Task.UI.Helper.Reports.CBS;
using CUP = Ovi.Task.UI.Helper.Reports.CUP;
using CUS = Ovi.Task.UI.Helper.Reports.CUS;
using INV = Ovi.Task.UI.Helper.Reports.INV;
using PFV = Ovi.Task.UI.Helper.Reports.PFV;
using POR = Ovi.Task.UI.Helper.Reports.POR;
using QUO = Ovi.Task.UI.Helper.Reports.QUO;
using SIN = Ovi.Task.UI.Helper.Reports.SIN;

namespace Ovi.Task.UI.Controllers
{
    public class PSPParameters
    {
        public string Customer { get; set; }

        public string Branch { get; set; }

        public string BranchType { get; set; }

        public string Authorized { get; set; }

        public string Tasktype { get; set; }

        public string TskTasktype { get; set; }

        public string Taskcategory { get; set; }

        public string InvoiceNo { get; set; }

        public string PSP { get; set; }

        public string PSPStatus { get; set; }

        public string Task { get; set; }

        public DateTime? PSPStart { get; set; }

        public DateTime? PSPEnd { get; set; }

        public DateTime? PSPInvoiceDateStart { get; set; }

        public DateTime? PSPInvoiceDateEnd { get; set; }

        public DateTime? TskStart { get; set; }

        public DateTime? TskEnd { get; set; }

        public string Type { get; set; }

        public string Format { get; set; }

        public char IncludeSecondTable { get; set; }

        public char HideParameters { get; set; }

        public char HideZero { get; set; }

        public char OnlyServiceForms { get; set; }

        public char HasQuotation { get; set; }

        public string GroupCode { get; set; }
        public string SHFTIP { get; set; }
        public string SHHYIL { get; set; }
        public string SHHAY { get; set; }


    }

    public class CUEParameters
    {
        public string Taskcategory { get; set; }

        public DateTime? TskCompletedStart { get; set; }

        public DateTime? TskCompletedEnd { get; set; }

        public string Type { get; set; }
    }

    public class WPRParameters
    {
        public string Taskcategory { get; set; }

        public DateTime? TskRequestedStart { get; set; }

        public DateTime? TskRequestedEnd { get; set; }

        public string Org { get; set; }

        public char HideParameters { get; set; }

        public char DontShowCanceled { get; set; }

        public string TaskType { get; set; }

        public string Customer { get; set; }

        public string Branches { get; set; }

        public string Type { get; set; }
    }

    public class SRP2Parameters
    {
        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }
        public char ZeroLaborCost { get; set; }

        public string Type { get; set; }
    }
    public class SRPParameters
    {
        public string Organization { get; set; }

        public string Customer { get; set; }

        public string CustomerGroup { get; set; }

        public string Branch { get; set; }

        public string Supplier { get; set; }

        public string Tasktyp { get; set; }

        public string Tasktype { get; set; }

        public string Taskcategory { get; set; }

        public string ActivityDepartment { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }

        public string Region { get; set; }

        public string Province { get; set; }

        public string Trade { get; set; }

        public string Type { get; set; }

        public string OnlyPSP { get; set; }

        public string OnlyCustomers { get; set; }
    }

    public class CUPParameters
    {
        public string Customer { get; set; }

        public string CustomerGroup { get; set; }

        public string Tasktype { get; set; }

        public string Type { get; set; }

        public char HIDEPARAMETERS { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }
    }

    public class CBSParameters
    {
        public string Organization { get; set; }

        public string Department { get; set; }

        public string OnlyPSP { get; set; }

        public char HideParameters { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }

        public string Type { get; set; }
    }

    public class CUSParameters
    {
        public string Customer { get; set; }

        public string CustomerGroup { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }

        public string Type { get; set; }

        public string GetAll { get; set; }
    }

    public class INVParameters
    {
        public long Invoice { get; set; }

        public string InvoiceType { get; set; }

        public string Type { get; set; }

        public string Format { get; set; }
    }

    public class QUOParameters
    {
        public int Quotation { get; set; }

        public string Type { get; set; }
    }

    public class ProjectParameters
    {
        public long ProjectId { get; set; }

        public string PrintDetailed { get; set; }

        public string Type { get; set; }
    }

    public class PFVParametes
    {
        public long? Project { get; set; }

        public long? Task { get; set; }

        public string Customer { get; set; }

        public string ProjectStatus { get; set; }

        public string ProjectType { get; set; }

        public string Tasktype { get; set; }

        public DateTime? CreatedStart { get; set; }

        public DateTime? CreatedEnd { get; set; }

        public string Type { get; set; }
    }

    public class PORParameters
    {
        public long Purchaseorder { get; set; }

        public string Type { get; set; }
    }

    public class SIVParameters
    {
        public int SalesInvoiceId { get; set; }
        public string Type { get; set; }
    }

    public class TSKParameters
    {
        public int TaskId { get; set; }

        public string Type { get; set; }
    }
    public class TDRParameters
    {
        public string Organization { get; set; }
        public string Department { get; set; }
        public DateTime? TaskCreatedStart { get; set; }
        public DateTime? TaskCreatedEnd { get; set; }
        public DateTime? TaskCompletedStart { get; set; }
        public DateTime? TaskCompletedEnd { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public string TaskType { get; set; }
        public string Customer { get; set; }
        public string CustomerGroup { get; set; }
        public string Branch { get; set; }
        public string Region { get; set; }
        public string Province { get; set; }
        public string Supplier { get; set; }
        public string Status { get; set; }
        public int PassedDaysLimit { get; set; }
        public string OutputType { get; set; }
    }

    public class BTCParameters
    {
        public string Customer { get; set; }
        public DateTime? TaskCreatedStart { get; set; }
        public DateTime? TaskCreatedEnd { get; set; }
        public string Type { get; set; }
    }

    public class DBTParameters
    {
        public string Department { get; set; }
        public DateTime Date { get; set; }
        public string Type { get; set; }
    }
    public class ReportsController : ReportBaseController
    {
        public ActionResult PSP()
        {
            return View();
        }

        public ActionResult PSPM1()
        {
            return View();
        }

        public ActionResult CUE()
        {
            return View();
        }

        public ActionResult SRP()
        {
            return View();
        }

        public ActionResult SRP2()
        {
            return View();
        }

        public ActionResult CUP()
        {
            return View();
        }

        public ActionResult CBS()
        {
            return View();
        }

        public ActionResult CUS()
        {
            return View();
        }

        public ActionResult WPR()
        {
            return View();
        }

        public ActionResult TDR()
        {
            return View();
        }

        public ActionResult RDR()
        {
            return View();
        }
        public ActionResult BTC()
        {
            return View();
        }

        public ActionResult DBT()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GenerateBTC(BTCParameters p)
        {
            var reportFile = "\\Reports\\BranchTaskCounts.rpt";
            var ds = new DataSet("VS");
            var btc = new BTC();

            ds.Tables.Add(btc.BTCParameters(p));
            ds.Tables.Add(btc.BTCLines(p));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("BTC_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }

        }

        [HttpPost]
        public ActionResult GenerateTDR(TDRParameters p)
        {
            var reportFile = "\\Reports\\TaskDetail.rpt";
            var ds = new DataSet("VS");
            var tdr = new TDR();

            ds.Tables.Add(tdr.TDRParameters(p));
            ds.Tables.Add(tdr.TDRSection1(p));
            ds.Tables.Add(tdr.TDRSection2(p));
            ds.Tables.Add(tdr.TDRSection3(p));
            ds.Tables.Add(tdr.TDRSection4(p));
            ds.Tables.Add(tdr.TDRSection5(p));
            ds.Tables.Add(tdr.TDRSection6(p));
            ds.Tables.Add(tdr.TDRSection7(p));
            ds.Tables.Add(tdr.TDRSection8(p));
            ds.Tables.Add(tdr.TDRSection9(p));
            ds.Tables.Add(tdr.TDRSection10(p));
            ds.Tables.Add(tdr.TDRSection11(p));
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.OutputType)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
           
        }

        [HttpPost]
        public ActionResult GenerateDBT(DBTParameters p)
        {
            var reportFile = "\\Reports\\DepartmentBasedTaskCounts.rpt";
            var ds = new DataSet("VS");
            var dbt = new DBT();

            RepositoryTasks repositoryTasks = new RepositoryTasks();

            var gridRequest = new GridRequest { loadall = true, filter = new GridFilters { Filters = new List<GridFilter>() } };
            gridRequest.filter.Filters.Add(new GridFilter { Field = "TSK_DEPARTMENT", Operator = "eq", Value = p.Department });
            gridRequest.filter.Filters.Add(new GridFilter { Field = "TSK_CREATED", Operator = "gte", Value = new DateTime(p.Date.Year, p.Date.Month, 1) });
            gridRequest.filter.Filters.Add(new GridFilter { Field = "TSK_CREATED", Operator = "lte", Value = new DateTime(p.Date.Year, p.Date.Month, DateTime.DaysInMonth(p.Date.Year,p.Date.Month)) });
            var tasks = repositoryTasks.ListView(gridRequest);
            ds.Tables.Add(dbt.DBTParameters(p));
            ds.Tables.Add(dbt.DBTSection1(tasks,p));
            ds.Tables.Add(dbt.DBTSection2(tasks));
            ds.Tables.Add(dbt.DBTSection3(tasks));
            ds.Tables.Add(dbt.DBTSection4(tasks));
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("DBT_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }

        }

        [HttpPost]
        public ActionResult GenerateRDR(TDRParameters p)
        {
            var reportFile = "\\Reports\\RegionalTaskDetail.rpt";
            var ds = new DataSet("VS");
            var tdr = new TDR();

            ds.Tables.Add(tdr.TDRParameters(p));
            ds.Tables.Add(tdr.TDRSection1(p));
            ds.Tables.Add(tdr.TDRSection2(p));
            ds.Tables.Add(tdr.TDRSection3(p));
            ds.Tables.Add(tdr.TDRRegionalSection4(p));
            ds.Tables.Add(tdr.TDRRegionalSection5(p));
            ds.Tables.Add(tdr.TDRSection6(p));
            ds.Tables.Add(tdr.TDRSection7(p));
            ds.Tables.Add(tdr.TDRSection8(p));
            ds.Tables.Add(tdr.TDRSection9(p));
            ds.Tables.Add(tdr.TDRRegionalSection10(p));
            ds.Tables.Add(tdr.TDRRegionalSection11(p));
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.OutputType)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }

        }

        [HttpPost]
        public ActionResult GenerateProjectOutput(ProjectParameters p)
        {
            var reportFile = "\\Reports\\Project.rpt";

            var repositoryProjects = new RepositoryProjects();
            var project = repositoryProjects.Get(p.ProjectId);

            #region DataTable

            var ds = new DataSet("Report");
            var ReportHeader = new DataTable("ReportHeader");
            ReportHeader.Columns.AddRange(new[]
            {
                new DataColumn("Customer"),
                new DataColumn("No"),
                new DataColumn("Subject"),
                new DataColumn("Currency"),
                new DataColumn("AddressInfo"),
                new DataColumn("Contact"),
                new DataColumn("ContactEMail"),
                new DataColumn("PaymentTerm")
            });

            var ReportLines = new DataTable("ReportLines");
            ReportLines.Columns.AddRange(new[]
            {
                new DataColumn("No"),
                new DataColumn("Quantity", typeof(decimal)),
                new DataColumn("Description"),
                new DataColumn("Price", typeof(decimal)),
            });

            ReportLines.Columns["Price"].AllowDBNull = true;

            if (project != null)
            {
                var repositoryProjectOfferRevisions = new RepositoryProjectOfferRevisions();
                var revisionCount = repositoryProjectOfferRevisions.GetCount(project.PRJ_ID);

                var repositoryParameters = new RepositoryParameters();
                var address = repositoryParameters.Get("ADDRESSINFO");
                var lastapprover = repositoryProjects.GetLastApprover(p.ProjectId);

                var ReportHeaderRow = ReportHeader.NewRow();
                ReportHeaderRow["Customer"] = project.PRJ_CUSTOMERDESC;
                ReportHeaderRow["Subject"] = project.PRJ_DESC;
                ReportHeaderRow["Currency"] = !string.IsNullOrEmpty(project.PRJ_CURR) ? project.PRJ_CURR : "TL";
                ReportHeaderRow["No"] =
                    string.Format("{0} / R{1} / {2}", project.PRJ_ID, revisionCount, project.PRJ_TYPE);
                ReportHeaderRow["AddressInfo"] = address != null ? address.PRM_VALUE : "";
                ReportHeaderRow["Contact"] = lastapprover != null ? lastapprover.USR_DESC : "";
                ReportHeaderRow["ContactEMail"] = lastapprover != null ? lastapprover.USR_EMAIL : "";
                ReportHeaderRow["PaymentTerm"] =
                    !string.IsNullOrEmpty(project.PRJ_PAYMENTTERM) ? project.PRJ_PAYMENTTERM : "";

                ReportHeader.Rows.Add(ReportHeaderRow);

                if (string.IsNullOrEmpty(p.PrintDetailed))
                {
                    var repositoryProjectPricing = new RepositoryProjectPricing();
                    var tasks = repositoryProjectPricing.ListTaskPricingSummary(project.PRJ_ID);
                    for (var i = 0; i < tasks.Count; i++)
                    {
                        var total = (i == 0 ? tasks[i].PPR_TOTAL + tasks[i].PPR_TAX2 : tasks[i].PPR_TOTAL);
                        total = ProjectTotals(total);

                        var ReportLinesRow = ReportLines.NewRow();
                        ReportLinesRow["No"] = (i + 1);
                        ReportLinesRow["Quantity"] = 1;
                        ReportLinesRow["Description"] = tasks[i].PPR_TASKSHORTDESC;
                        ReportLinesRow["Price"] = total.HasValue
                            ? (object)total
                            : DBNull.Value;
                        ReportLines.Rows.Add(ReportLinesRow);
                    }

                    ;
                }
                else
                {
                    var lastoffer = repositoryProjectOfferRevisions.GetLastOffer(project.PRJ_ID);
                    if (lastoffer != null)
                    {
                        var line1Total = lastoffer.PRV_LABORSUM + lastoffer.PRV_MISCCOST + lastoffer.PRV_TOOL +
                                         project.PRJ_QUOTAX2;
                        line1Total = ProjectTotals(line1Total);

                        // Line 1
                        var ReportLinesRow = ReportLines.NewRow();
                        ReportLinesRow["No"] = "1";
                        ReportLinesRow["Quantity"] = 1;
                        ReportLinesRow["Description"] = ProjectStrings.laborcosts;
                        ReportLinesRow["Price"] = line1Total.HasValue
                            ? (object)line1Total
                            : DBNull.Value;
                        ReportLines.Rows.Add(ReportLinesRow);

                        // Line 2
                        ReportLinesRow = ReportLines.NewRow();
                        ReportLinesRow["No"] = "2";
                        ReportLinesRow["Quantity"] = 1;
                        ReportLinesRow["Description"] = ProjectStrings.parts;
                        ReportLinesRow["Price"] = lastoffer.PRV_PART.HasValue
                            ? (object)ProjectTotals(lastoffer.PRV_PART)
                            : DBNull.Value;
                        ReportLines.Rows.Add(ReportLinesRow);
                    }
                }
            }

            #endregion DataTable

            ds.Tables.Add(ReportHeader);
            ds.Tables.Add(ReportLines);
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("Project_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        private static int? ProjectTotals(decimal? total)
        {
            if (total == null)
            {
                return null;
            }

            var ltotal = (int)total;
            if ((ltotal % 100 > 50))
            {
                ltotal = ltotal + (100 - (ltotal % 100));
            }
            else if ((ltotal % 100 < 50))
            {
                ltotal = ltotal + (50 - ((ltotal % 100)));
            }

            return ltotal;
        }

        [HttpPost]
        public ActionResult GeneratePSP(PSPParameters p)
        {
            try
            {
                string reportFile;
                switch (p.Format)
                {
                    case "F2":
                        reportFile = "\\Reports\\Hakedis2.rpt";
                        break;

                    case "F3":
                        reportFile = "\\Reports\\Hakedis3.rpt";
                        break;
                    case "F4":
                        reportFile = "\\Reports\\Hakedis4.rpt";
                        break;
                    case "F5":
                        reportFile = "\\Reports\\Hakedis5.rpt";
                        break;
                    default:
                        reportFile = "\\Reports\\Hakedis.rpt";
                        break;
                }

                var rptH = new ReportDocument();
                var psp = new PSP();
                var repositoryProgressPayments = new RepositoryProgressPayments();
                var lines = repositoryProgressPayments.ListReportLines(psp.BuildPSPGridFilter(p));
                var taskarr = new List<long>();

                #region DataTable

                var ds = new DataSet("VS");
                var parametersTable = new DataTable("PARAMETRELER");
                parametersTable.Columns.AddRange(new[]
                {
                    new DataColumn("MUSTERI"),
                    new DataColumn("SUBE"),
                    new DataColumn("GOREVTIPI"),
                    new DataColumn("GOREVTURU"),
                    new DataColumn("ISIYAPAN"),
                    new DataColumn("HAKEDISTARIHARALIGI"),
                    new DataColumn("HAKEDISKODU"),
                    new DataColumn("GOREVKODU"),
                    new DataColumn("FATURABILGISI"),
                    new DataColumn("OZETTABLO"),
                    new DataColumn("HIDEPARAMETERS"),
                    new DataColumn("MUSTERIYETKILISI"),
                    new DataColumn("GOREVKATEGORISI"),
                    new DataColumn("HAKEDISDURUMU"),
                    new DataColumn("GRUPKODU"),
                    new DataColumn("FATURATARIHI"),
                    new DataColumn("GOREVTARIHARALIGI"),
                    new DataColumn("SIFIRGOSTERME"),
                    new DataColumn("RAPORUALAN"),
                    new DataColumn("RAPORTARIHI"),
                    new DataColumn("SHFTIP"),
                    new DataColumn("SHHYIL"),
                    new DataColumn("SHHAY")
                });

                var taskTable = new DataTable("TASKS");
                taskTable.Columns.AddRange(new[]
                {
                    new DataColumn("TSKCUSTOMER"),
                    new DataColumn("TSKCUSTOMERDESC"),
                    new DataColumn("TSKBRANCH"),
                    new DataColumn("TSKBRANCHDESC"),
                    new DataColumn("TSKBRANCHREFERENCE"),
                    new DataColumn("TSKBRNTYPE"),
                    new DataColumn("TSKTYPE"),
                    new DataColumn("TSKTYPEDESC"),
                    new DataColumn("TSK"),
                    new DataColumn("TSKREFERENCE"),
                    new DataColumn("TSKDESC"),
                    new DataColumn("TSKREQUESTED"),
                    new DataColumn("TSKCOMPLETED"),
                    new DataColumn("TSKNOTE"),
                    new DataColumn("TSKTOTAL"),
                    new DataColumn("TSKBRNAUTHORIZED"),
                    new DataColumn("TSKPSP"),
                    new DataColumn("TSKPSPSTATUS"),
                    new DataColumn("TSKCATDESC"),
                    new DataColumn("PSPINVOICENO"),
                    new DataColumn("TSKDURATION"),
                    new DataColumn("TSKHOLDDURATION"),
                    new DataColumn("HASQUOTATION"),
                    new DataColumn("PSPGROUPCODE"),
                    new DataColumn("SHFTIP"),
                    new DataColumn("SHHYIL"),
                    new DataColumn("SHHAY")
                });


                var pricinSummTable = new DataTable("PRICINGSUMM");
                pricinSummTable.Columns.AddRange(new[]
                {
                    new DataColumn("LINE", typeof(int)),
                    new DataColumn("TASK", typeof(int)),
                    new DataColumn("TSKREFERENCE"),
                    new DataColumn("TSKREQUESTED", typeof(DateTime)),
                    new DataColumn("TSKCOMPLETED", typeof(DateTime)),
                    new DataColumn("BRNREFERENCE"),
                    new DataColumn("BRNDESC"),
                    new DataColumn("TSKCATDESC"),
                    new DataColumn("TSKTYPEDESC"),
                    new DataColumn("TSKSHORTDESC"),
                    new DataColumn("CUSPM"),
                    new DataColumn("SERVICEFEE", typeof(decimal)),
                    new DataColumn("PARTTOTAL", typeof(decimal)),
                    new DataColumn("TOTAL", typeof(decimal)),
                    new DataColumn("VAT", typeof(decimal)),
                    new DataColumn("GRANDTOTAL", typeof(decimal))
            });

                var pricingTable = new DataTable("PRICING");
                pricingTable.Columns.AddRange(new[]
                {
                    new DataColumn("TSK"),
                    new DataColumn("ACT"),
                    new DataColumn("ACTDESC"),
                    new DataColumn("UNITPRICE"),
                    new DataColumn("TOTAL"),
                    new DataColumn("UOM"),
                    new DataColumn("QTY"),
                    new DataColumn("TYPE"),
                    new DataColumn("SUBTYPE"),
                    new DataColumn("TYPEDESC"),
                    new DataColumn("HASQUOTATION"),
                    new DataColumn("MAILRECIPIENTS")

                });

                pricingTable.Columns["ACT"].AllowDBNull = true;
                pricingTable.Columns["ACTDESC"].AllowDBNull = true;

                #endregion DataTable

                var rowParams = parametersTable.NewRow();
                rowParams["MUSTERI"] = string.IsNullOrEmpty(p.Customer) ? "TÜMÜ" : p.Customer;
                rowParams["SUBE"] = string.IsNullOrEmpty(p.Branch) ? "TÜMÜ" : p.Branch;
                rowParams["GOREVTIPI"] = string.IsNullOrEmpty(p.Tasktype) ? "TÜMÜ" : p.Tasktype;
                rowParams["GOREVTURU"] = string.IsNullOrEmpty(p.TskTasktype) ? "TÜMÜ" : p.TskTasktype;
                rowParams["HAKEDISTARIHARALIGI"] = string.Format("{0} - {1}",
                    (p.PSPStart.HasValue
                        ? p.PSPStart.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture)
                        : "?"),
                    (p.PSPEnd.HasValue ? p.PSPEnd.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture) : "?"));

                rowParams["HAKEDISKODU"] = string.IsNullOrEmpty(p.PSP) ? "-" : p.PSP;
                rowParams["GRUPKODU"] = string.IsNullOrEmpty(p.GroupCode) ? "-" : p.GroupCode;
                rowParams["FATURABILGISI"] = string.IsNullOrEmpty(p.InvoiceNo) ? "-" : p.InvoiceNo;
                rowParams["MUSTERIYETKILISI"] = string.IsNullOrEmpty(p.Authorized) ? "-" : p.Authorized;
                rowParams["GOREVKODU"] = string.IsNullOrEmpty(p.Task) ? "-" : p.Task;
                rowParams["OZETTABLO"] = p.IncludeSecondTable == '+' ? "+" : "-";
                rowParams["HIDEPARAMETERS"] = p.HideParameters == '+' ? "+" : "-";
                rowParams["GOREVKATEGORISI"] = string.IsNullOrEmpty(p.Taskcategory) ? "TÜMÜ" : p.Taskcategory;
                rowParams["GOREVTURU"] = string.IsNullOrEmpty(p.TskTasktype) ? "TÜMÜ" : p.TskTasktype;
                rowParams["HAKEDISDURUMU"] = string.IsNullOrEmpty(p.PSPStatus) ? "TÜMÜ" : p.PSPStatus;
                rowParams["FATURATARIHI"] = string.Format("{0} - {1}",
                    (p.PSPInvoiceDateStart.HasValue
                        ? p.PSPInvoiceDateStart.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture)
                        : "?"),
                    (p.PSPInvoiceDateEnd.HasValue ? p.PSPInvoiceDateEnd.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture) : "?"));

                rowParams["GOREVTARIHARALIGI"] = string.Format("{0} - {1}",
                    (p.TskStart.HasValue
                        ? p.TskStart.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture)
                        : "?"),
                    (p.TskEnd.HasValue ? p.TskEnd.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture) : "?"));
                rowParams["SIFIRGOSTERME"] = p.HideZero == '+' ? "+" : "-";
                rowParams["RAPORTARIHI"] = DateTime.Now;
                rowParams["RAPORUALAN"] = UserManager.Instance.User.Description;
                rowParams["SHFTIP"] = string.IsNullOrEmpty(p.SHFTIP) ? "-" : p.SHFTIP;
                rowParams["SHHYIL"] = string.IsNullOrEmpty(p.SHHYIL) ? "-" : p.SHHYIL;
                rowParams["SHHAY"] = string.IsNullOrEmpty(p.SHHAY) ? "-" : p.SHHAY;

                parametersTable.Rows.Add(rowParams);

                foreach (var linei in lines)
                {
                    var taskRow = taskTable.NewRow();
                    taskRow["TSKCUSTOMER"] = linei.RPP_TSKCUSTOMER;
                    taskRow["TSKCUSTOMERDESC"] = linei.RPP_TSKCUSTOMERDESC;
                    taskRow["TSKBRANCH"] = linei.RPP_TSKBRANCH;
                    taskRow["TSKBRANCHDESC"] = linei.RPP_TSKBRANCHDESC;
                    taskRow["TSKBRANCHREFERENCE"] = linei.RPP_TSKBRANCHREFERENCE;
                    taskRow["TSKBRNTYPE"] = linei.RPP_BRNTYPE;
                    taskRow["TSKTYPE"] = linei.RPP_TSKTYPE;
                    taskRow["TSKTYPEDESC"] = linei.RPP_TSKCATDESC;
                    taskRow["TSK"] = linei.RPP_TSK;
                    taskRow["TSKREFERENCE"] = linei.RPP_TSKREFERENCE;
                    taskRow["TSKDESC"] = linei.RPP_TSKDESC;
                    taskRow["TSKREQUESTED"] = linei.RPP_TSKREQUESTED;
                    taskRow["TSKCOMPLETED"] = linei.RPP_TSKCOMPLETED;
                    taskRow["TSKTOTAL"] = linei.RPP_TSKTOTAL;
                    taskRow["TSKNOTE"] = linei.RPP_NOTE;
                    taskRow["TSKBRNAUTHORIZED"] = linei.RPP_BRNAUTHORIZED;
                    taskRow["TSKPSP"] = string.Format("{0} / {1}", linei.RPP_PSP, linei.RPP_PSPSTATUSDESC);
                    taskRow["TSKPSPSTATUS"] = linei.RPP_PSPSTATUSDESC;
                    taskRow["TSKCATDESC"] = linei.RPP_TSKCATDESC;
                    taskRow["PSPINVOICENO"] = linei.RPP_PSPINVOICENO;
                    taskRow["PSPGROUPCODE"] = linei.RPP_PSPGROUP;
                    taskRow["TSKDURATION"] = linei.RPP_TSKDURATIONSTR;
                    taskRow["TSKHOLDDURATION"] = linei.RPP_TSKHOLDDURATIONSTR;
                    taskRow["HASQUOTATION"] = linei.RPP_HASQUOTATION;
                    taskRow["SHFTIP"] = linei.RPP_SHFTIP_DESC;
                    taskRow["SHHYIL"] = linei.RPP_SHHYIL_DESC;
                    taskRow["SHHAY"] = linei.RPP_SHHAY_DESC;


                    taskTable.Rows.Add(taskRow);
                    taskarr.Add(linei.RPP_TSK);
                }

                if (taskTable.Rows.Count <= 0)
                {
                    return new EmptyResult();
                }

                var arrSize = 1000;
                if (taskarr.Count > arrSize)
                {
                    var splittedTaskArr = taskarr.ToArray().Split(arrSize);
                    foreach (var arr in splittedTaskArr)
                    {
                        psp.PSPPricingLines(p, arr, pricingTable, pricinSummTable);
                    }
                }
                else
                {
                    psp.PSPPricingLines(p, taskarr, pricingTable, pricinSummTable);
                }

                ds.Tables.Add(parametersTable);
                ds.Tables.Add(taskTable);          
                ds.Tables.Add(pricingTable);
                ds.Tables.Add(pricinSummTable);
                rptH.Load(Server.MapPath(reportFile));
                rptH.SetDataSource(ds);

                if (p.HideParameters == '+')
                    rptH.ReportDefinition.Sections[0].SectionFormat.EnableSuppress = true;

                if (p.IncludeSecondTable != '+')
                    rptH.ReportDefinition.Sections[1].SectionFormat.EnableSuppress = true;





                switch (p.Type)
                {
                    case "PDF":
                        {
                            var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                            return File(stream, "application/pdf");
                        }
                    case "XLS":
                        {
                            var efo = new ExcelFormatOptions { 
                                ExcelUseConstantColumnWidth = true,
                            };
                            rptH.ExportOptions.FormatOptions = efo;
                            var stream = rptH.ExportToStream(ExportFormatType.Excel);
                            return File(stream, "application/vnd.ms-excel",
                                string.Format("PSP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                        }
                    case "ZIP":
                        {
                            return psp.ZFile(Response, rptH, lines, p.OnlyServiceForms == '+');
                        }
                    default:
                        {
                            var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                            return File(stream, "application/pdf");
                        }
                }
            }
            catch (Exception exc)
            {
                return View("Error", new HandleErrorInfo(exc, "Error", "Index"));
            }
        }

        [HttpPost]
        public ActionResult GenerateCUE(CUEParameters p)
        {
            var reportFile = "\\Reports\\MusteriEkipman.rpt";

            #region DataTable

            var ds = new DataSet("CUE");
            var linesTable = new DataTable("LINES");
            linesTable.Columns.AddRange(new[]
            {
                new DataColumn("MUSTERI"),
                new DataColumn("TANIM"),
                new DataColumn("GRUP"),
                new DataColumn("MUSTERI_OLUSTURMA", typeof(DateTime)),
                new DataColumn("AKTIF"),
                new DataColumn("TOPLAM_SUBE", typeof(int)),
                new DataColumn("TOPLAM_AKTIF_SUBE", typeof(int)),
                new DataColumn("TOPLAM_BAKIM_IS_EMRI", typeof(int)),
                new DataColumn("TOPLAM_BAKIM_YAPILAN_SUBE", typeof(int)),
                new DataColumn("EKIPMANI_OLAN_SUBE", typeof(int)),
                new DataColumn("EKIPMANI_OLMAYAN_SUBE", typeof(int)),
                new DataColumn("TOPLAM_EKIPMAN_SAYISI", typeof(int)),
            });

            #endregion DataTable

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var lines = repositoryCustomerReport.ListCustomerEquipment(new CustomerEquipmentParameters
            {
                StartDate = p.TskCompletedStart,
                EndDate = p.TskCompletedEnd.HasValue
                    ? p.TskCompletedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                    : (DateTime?)null,
                Categories = !string.IsNullOrEmpty(p.Taskcategory) ? p.Taskcategory.Split(',') : new string[] {}
            });

            for (var i = 0; i < lines.Count; i++)
            {
                var line = lines[i];
                var row = linesTable.NewRow();
                row["MUSTERI"] = line.MUSTERI;
                row["TANIM"] = line.TANIM;
                row["GRUP"] = line.GRUP;
                row["MUSTERI_OLUSTURMA"] = line.MUSTERI_OLUSTURMA;
                row["AKTIF"] = line.AKTIF;
                row["TOPLAM_SUBE"] = line.TOPLAM_SUBE;
                row["TOPLAM_AKTIF_SUBE"] = line.TOPLAM_AKTIF_SUBE;
                row["TOPLAM_BAKIM_IS_EMRI"] = line.TOPLAM_BAKIM_IS_EMRI;
                row["TOPLAM_BAKIM_YAPILAN_SUBE"] = line.TOPLAM_BAKIM_YAPILAN_SUBE;
                row["EKIPMANI_OLAN_SUBE"] = line.EKIPMANI_OLAN_SUBE;
                row["EKIPMANI_OLMAYAN_SUBE"] = line.EKIPMANI_OLMAYAN_SUBE;
                row["TOPLAM_EKIPMAN_SAYISI"] = line.TOPLAM_EKIPMAN_SAYISI;
                linesTable.Rows.Add(row);
            }

            ds.Tables.Add(linesTable);
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = true };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("CUE_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]

        public ActionResult GenerateSRP2(SRP2Parameters p)
        {
            var reportFile = "\\Reports\\ServisOzet.rpt";         
            var ds = new DataSet("VS");
            var srp2 = new SRP2();
           
            ds.Tables.Add(srp2.GetActivities(p));
            ds.Tables.Add(srp2.GetNotes());
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }


        [HttpPost]
        public ActionResult GenerateSRP(SRPParameters p)
        {
            var reportFile = "\\Reports\\Servis.rpt";

            var ds = new DataSet("VS");
            var srp = new SRP();
            ds.Tables.Add(srp.GetActivities(p));
            
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateCUP(CUPParameters p)
        {
            var cup = new CUP();
            var reportFile = "\\Reports\\MusteriPerformans.rpt";
            var ds = new DataSet("VS");
            ds.Tables.Add(cup.CUPLines(p));
            ds.Tables.Add(cup.CUPSum(p));
            ds.Tables.Add(cup.CUPParameters(p));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("CUP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateCBS(CBSParameters p)
        {
            var reportFile = "\\Reports\\MusteriCiro.rpt";
            var cbs = new CBS();

            var repositoryCustomerSalesReport = new RepositoryCustomerSalesReport();
            var lines = repositoryCustomerSalesReport.List(new CustomerSalesReportParameters
            {
                Organization = p.Organization,
                Department = p.Department,
                OnlyPSP = string.IsNullOrEmpty(p.OnlyPSP) ? "-" : p.OnlyPSP,
                TaskCompletedStart =
                    (p.TaskCompletedStart.HasValue ? p.TaskCompletedStart.Value.Date : (DateTime?)null),
                TaskCompletedEnd = (p.TaskCompletedEnd.HasValue
                    ? p.TaskCompletedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                    : (DateTime?)null)
            });

            var ds = new DataSet("VS");
            ds.Tables.Add(cbs.CBSParameters(p));
            ds.Tables.Add(cbs.CBSLines(lines));
            ds.Tables.Add(cbs.CBSChartData(lines));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateCUS(CUSParameters p)
        {
            var reportFile = "\\Reports\\Musteri.rpt";
            var ds = new DataSet("VS");

            var cus = new CUS();

            if (p.TaskCompletedEnd.HasValue)
            {
                p.TaskCompletedEnd = p.TaskCompletedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59);
            }

            ds.Tables.Add(cus.CUSHeader(p));
            ds.Tables.Add(cus.CUSSection1(p));
            ds.Tables.Add(cus.CUSSection2(p));
            ds.Tables.Add(cus.CUSSection3(p));
            ds.Tables.Add(cus.CUSSection4(p));
            ds.Tables.Add(cus.CUSSection5(p));
            ds.Tables.Add(cus.CUSSection6(p));
            ds.Tables.Add(cus.CUSSection7(p));
            ds.Tables.Add(cus.CUSSection8(p));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateINV(INVParameters p)
        {
            var grLines = new GridRequest { loadall = true, filter = new GridFilters { Filters = new List<GridFilter>() } };
            var inv = new INV();

            var repositoryInvoices = new RepositoryInvoices();
            var invoice = repositoryInvoices.Get(p.Invoice);

            var ds = new DataSet("VS");
            ds.Tables.Add(inv.InvoiceHeader(invoice));
            var rptH = new ReportDocument();


            if (p.InvoiceType != "IADE")
            {
                string reportFile;
                switch (p.Format)
                {
                    case "F1":
                        reportFile = "\\Reports\\Fatura.rpt";
                        break;
                    case "F2":
                        reportFile = "\\Reports\\Fatura2.rpt";
                        break;
                    default:
                        reportFile = "\\Reports\\Fatura.rpt";
                        break;
                }
               
                grLines.filter.Filters.Add(new GridFilter { Field = "TSA_TSKIPP", Operator = "eq", Value = "+" });
                grLines.filter.Filters.Add(new GridFilter
                { Field = "TSA_TSKORGANIZATION", Operator = "eq", Value = invoice.INV_ORG });
                grLines.filter.Filters.Add(
                    new GridFilter { Field = "TSA_INVOICE", Operator = "eq", Value = invoice.INV_CODE });
                var lines = repositoryInvoices.ListLines(grLines);

                if (lines.Count == 0)
                {
                    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
                }

                ds.Tables.Add(inv.InvoiceLines(lines, invoice));
                if(p.Format == "F2")
                {
                    ds.Tables.Add(inv.InvoiceLineDetails(lines));
                }
              
                rptH.Load(Server.MapPath(reportFile));
            }
            else
            {
                var reportFile = "\\Reports\\IadeFatura.rpt";
                var returnInvoices = invoice.INV_RETURNINVOICE.Split(',');
                var returnInvoiceJArray = new JArray(returnInvoices);

                grLines.filter.Filters.Add(new GridFilter { Field = "SIL_INVOICE", Operator = "in", Value = returnInvoiceJArray });
                grLines.filter.Filters.Add(new GridFilter { Field = "SIL_ALREADYRETURNED", Operator = "gt", Value = 0 });
                grLines.filter.Filters.Add(new GridFilter { Field = "SIL_IRLINVOICECODE", Operator = "eq", Value = invoice.INV_CODE });

                var lines = repositoryInvoices.InvoiceLineDetails(grLines);
                ds.Tables.Add(inv.InvoiceReturnLines(lines, invoice));
                rptH.Load(Server.MapPath(reportFile));
            }

            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateQUO2(QUOParameters p)
        {
            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                return null;
            }

            var quo = new QUO();

            var reportFile = "\\Reports\\Quotation2.rpt";
            var grLines = new GridRequest
            {
                loadall = true,
                filter = new GridFilters { Filters = new List<GridFilter>() },
                sort = new List<GridSort>()
            };

            var repositoryQuotations = new RepositoryQuotations();
            var quotation = repositoryQuotations.GetView(p.Quotation);

            IList<QUOTATIONFORMAT2> lines;
            try
            {
                lines = repositoryQuotations.GetFormat2List(p.Quotation);
            }
            catch (Exception exc)
            {
                throw new TmsException(exc.Message);
            }

            if (lines == null || lines.Count == 0)
            {
                throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
            }

            var ds = new DataSet("VS");
            ds.Tables.Add(quo.QuotationHeader(quotation));
            ds.Tables.Add(quo.QuotationTo(quotation));
            ds.Tables.Add(quo.QuotationFrom(quotation));
            ds.Tables.Add(quo.QuotationLines2(lines));
            ds.Tables.Add(quo.QuotationDescriptions(quotation));
            //ds.Tables.Add(quo.QuotationTotal(lines));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateQUO(QUOParameters p)
        {
            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                return null;
            }

            var quo = new QUO();

            var reportFile = "\\Reports\\Quotation.rpt";
            var grLines = new GridRequest
            {
                loadall = true,
                filter = new GridFilters { Filters = new List<GridFilter>() },
                sort = new List<GridSort>()
            };

            var repositoryQuotations = new RepositoryQuotations();
            var quotation = repositoryQuotations.GetView(p.Quotation);

            grLines.filter.Filters.Add(new GridFilter
            { Field = "QLN_QUOTATION", Operator = "eq", Value = quotation.QUO_ID });

            if (ConfigHelper.Get("HideSalesSection") == "-")
                grLines.filter.Filters.Add(new GridFilter { Field = "QLN_TOTALPRICE", Operator = "neq", Value = 0 });

            grLines.sort.Add(new GridSort { Dir = "ASC", Field = "QLN_NO" });
            var lines = repositoryQuotations.ListLinesView(grLines);

            if (lines.Count == 0)
            {
                throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
            }

            var ds = new DataSet("VS");
            ds.Tables.Add(quo.QuotationHeader(quotation));
            ds.Tables.Add(quo.QuotationTo(quotation));
            ds.Tables.Add(quo.QuotationFrom(quotation));
            ds.Tables.Add(quo.QuotationLines(lines, quotation));
            ds.Tables.Add(quo.QuotationDescriptions(quotation));
            ds.Tables.Add(quo.QuotationTotal(lines));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SRP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GeneratePFV(PFVParametes p)
        {
            var reportFile = "\\Reports\\ProjectFinancialView.rpt";
            var gr = new GridRequest { loadall = true, filter = new GridFilters { Filters = new List<GridFilter>() } };
            var pfv = new PFV();

            if (p.Project.HasValue)
            {
                gr.filter.Filters.Add(new GridFilter { Field = "PRJ_ID", Operator = "eq", Value = p.Project });
            }

            if (p.Task.HasValue)
            {
                gr.filter.Filters.Add(new GridFilter { Field = "PRJ_TSKID", Operator = "eq", Value = p.Task });
            }

            if (!string.IsNullOrEmpty(p.ProjectType))
            {
                gr.filter.Filters.Add(new GridFilter { Field = "PRJ_TYPE", Operator = "eq", Value = p.ProjectType });
            }

            if (!string.IsNullOrEmpty(p.Customer))
            {
                gr.filter.Filters.Add(new GridFilter { Field = "PRJ_CUSTOMER", Operator = "eq", Value = p.Customer });
            }

            if (!string.IsNullOrEmpty(p.ProjectStatus))
            {
                gr.filter.Filters.Add(new GridFilter { Field = "PRJ_STATUS", Operator = "eq", Value = p.ProjectStatus });
            }

            if (!string.IsNullOrEmpty(p.Tasktype))
            {
                gr.filter.Filters.Add(new GridFilter { Field = "PRJ_TSKTYPE", Operator = "eq", Value = p.Tasktype });
            }

            if (p.CreatedStart.HasValue && p.CreatedEnd.HasValue)
            {
                gr.filter.Filters.Add(new GridFilter
                {
                    Field = "PRJ_CREATED",
                    Operator = "between",
                    Value = p.CreatedStart.Value.Date,
                    Value2 = p.CreatedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                });
            }

            var repositoryProjects = new RepositoryProjects();
            var fvlines = repositoryProjects.GetFinancialView(gr);

            var ds = new DataSet("VS");
            ds.Tables.Add(pfv.PFVLines(fvlines));
            ds.Tables.Add(pfv.PFVChart01(fvlines));
            ds.Tables.Add(pfv.PFVParameters(p));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("CUP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GeneratePOR(PORParameters p)
        {

            var por = new POR();

            var reportFile = "\\Reports\\SatinAlmaEmri.rpt";
            var grLines = new GridRequest
            {
                loadall = true,
                filter = new GridFilters { Filters = new List<GridFilter>() },
                sort = new List<GridSort>()
            };

            var repositoryPurchaseOrders = new RepositoryPurchaseOrders();
            var purchaseOrder = repositoryPurchaseOrders.Get(p.Purchaseorder);

            grLines.filter.Filters.Add(new GridFilter
            { Field = "PRL_PORID", Operator = "eq", Value = purchaseOrder.POR_ID });

            grLines.sort.Add(new GridSort { Dir = "ASC", Field = "PRL_LINE" });

            var repositoryPurchaseOrderLines = new RepositoryPurchaseOrderLines();
            var lines = repositoryPurchaseOrderLines.List(grLines);

            if (lines.Count == 0)
            {
                throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
            }

            var ds = new DataSet("VS");
            ds.Tables.Add(por.PurchaseOrderHeader(purchaseOrder));
            ds.Tables.Add(por.PurchaseOrderLines(lines));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("POR_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateWPR(WPRParameters p)
        {
            var wpr = new WPR();
            var reportFile = "\\Reports\\BeklemePerformansRaporu.rpt";

            var repositoryTasks = new RepositoryTasks();
            var repositoryQuotations = new RepositoryQuotations();

            var grStatusLines = new GridRequest
            {
                loadall = true,
                filter = new GridFilters { Filters = new List<GridFilter>() },
                sort = new List<GridSort>()
            };


            if (!string.IsNullOrEmpty(p.Branches))
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                { Field = "SPR_BRANCH", Operator = "eq", Value = p.Branches });
            }
            if (p.DontShowCanceled == '+')
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                { Field = "SPR_STATUS", Operator = "neq", Value = "IPT" });
            }
            if (!string.IsNullOrEmpty(p.Customer))
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                { Field = "SPR_CUSTOMER", Operator = "eq", Value = p.Customer });
            }
            if (!string.IsNullOrEmpty(p.Org))
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                { Field = "SPR_TSKORG", Operator = "eq", Value = p.Org });
            }
            if (!string.IsNullOrEmpty(p.TaskType))
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                { Field = "SPR_TSKTASKTYPE", Operator = "eq", Value = p.TaskType });
            }
            if (!string.IsNullOrEmpty(p.Taskcategory))
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                { Field = "SPR_CAT", Operator = "in", Value = new JArray(p.Taskcategory.Split(',')) });
            }
            if (p.TskRequestedStart.HasValue && p.TskRequestedEnd.HasValue)
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                {
                    Field = "SPR_TSKREQUESTED",
                    Operator = "between",
                    Value = p.TskRequestedStart.Value.Date,
                    Value2 = p.TskRequestedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                });
            }
            else if (p.TskRequestedStart.HasValue)
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                {
                    Field = "SPR_TSKREQUESTED",
                    Operator = "gte",
                    Value = p.TskRequestedStart.Value.Date
                });
            }
            else if (p.TskRequestedEnd.HasValue)
            {
                grStatusLines.filter.Filters.Add(new GridFilter
                {
                    Field = "SPR_TSKREQUESTED",
                    Operator = "lte",
                    Value = p.TskRequestedEnd.Value.Date
                });
            }

            grStatusLines.sort.Add(new GridSort { Dir = "DESC", Field = "SPR_TSK" });

            var statusLines = repositoryTasks.TaskStatusDurations(grStatusLines);

            if (statusLines == null || statusLines.Count == 0)
            {
                throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
            }

            var quoLines = new List<TMQUOTATIONDURATIONS>();
            var tasklist = statusLines.Select(x => x.SPR_TSK).ToList();
            var arrSize = 1000;
            if (tasklist.Count > arrSize)
            {
                var splittedTaskArr = tasklist.ToArray().Split(arrSize);
                foreach (var arr in splittedTaskArr)
                {
                    var quoGrdReq = new GridRequest
                    {
                        loadall = true,
                        filter = new GridFilters
                        {
                            Filters = new List<GridFilter>()
                            {
                                new GridFilter { Field = "QSP_TSKID", Operator = "in", Value = new JArray(arr) }
                            }
                        }
                    };
                    quoLines.AddRange(repositoryQuotations.QuotationStatusDurations(quoGrdReq));
                }
            }
            else
            {
                var quoGrdReq = new GridRequest
                {
                    loadall = true,
                    filter = new GridFilters
                    {
                        Filters = new List<GridFilter>()
                        {
                            new GridFilter { Field = "QSP_TSKID", Operator = "in", Value = new JArray(tasklist) }
                        }
                    }
                };
                quoLines.AddRange(repositoryQuotations.QuotationStatusDurations(quoGrdReq));
            }

            var totalClosed = statusLines.Sum(x => x.SPR_TOTALCLOSEDMINUTES);

            var ds = new DataSet("VS");
            var paramTable = new DataTable("Parameters");
            paramTable.Columns.AddRange(new[]
            {
                new DataColumn("TaskCategory"),
                new DataColumn("RequestBetween"),
                new DataColumn("Org"),
                new DataColumn("TaskType"),
                new DataColumn("HideParameters"),
                new DataColumn("Customer"),
                new DataColumn("Branches"),
                new DataColumn("CreatedBy"),
                new DataColumn("TaskCount",typeof(int)),
                new DataColumn("AvgClosed"),
                new DataColumn("Created",typeof(DateTime))
            });

            paramTable.Columns["TaskCategory"].AllowDBNull = true;
            paramTable.Columns["RequestBetween"].AllowDBNull = true;
            paramTable.Columns["Org"].AllowDBNull = true;
            paramTable.Columns["TaskType"].AllowDBNull = true;
            paramTable.Columns["Customer"].AllowDBNull = true;

            var rowParams = paramTable.NewRow();
            rowParams["TaskCategory"] = string.IsNullOrEmpty(p.Taskcategory) ? "TÜMÜ" : p.Taskcategory;
            rowParams["RequestBetween"] = string.Format("{0} - {1}",
                (p.TskRequestedStart.HasValue
                    ? p.TskRequestedStart.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture)
                    : "?"),
                (p.TskRequestedEnd.HasValue ? p.TskRequestedEnd.Value.ToString(OviShared.ShortDate, CultureInfo.InvariantCulture) : "?"));
            rowParams["Org"] = string.IsNullOrEmpty(p.Org) ? "TÜMÜ" : p.Org;
            rowParams["TaskType"] = string.IsNullOrEmpty(p.TaskType) ? "TÜMÜ" : p.TaskType;
            rowParams["Customer"] = string.IsNullOrEmpty(p.Customer) ? "TÜMÜ" : p.Customer;
            rowParams["Branches"] = string.IsNullOrEmpty(p.Branches) ? "TÜMÜ" : p.Branches;
            rowParams["HideParameters"] = p.HideParameters == '+' ? "+" : "-";
            rowParams["CreatedBy"] = UserManager.Instance.User.Description; ;
            rowParams["Created"] = DateTime.Now;
            rowParams["TaskCount"] = statusLines.Count;
            rowParams["AvgClosed"] = Convert.ToInt32((totalClosed / statusLines.Count) / 1440) + " Gün " + Convert.ToInt32(((totalClosed / statusLines.Count) % 1440) / 60) + " Saat " + Convert.ToInt32((totalClosed / statusLines.Count) % 60) + " Dakika"; ;

            paramTable.Rows.Add(rowParams);

            #region statusavg
            var statusAverageTable = new DataTable("StatusAverage");
            statusAverageTable.Columns.AddRange(new[]
            {
                new DataColumn("DURUM"),
                new DataColumn("AVGTIMES"),
                new DataColumn("AVG",typeof(int)),
            });


            var avgA = statusLines.Average(x => x.SPR_AMINUTES);
            var avgPA = statusLines.Average(x => x.SPR_PAMINUTES);
            var avgT = statusLines.Average(x => x.SPR_TMINUTES);
            var avgTAM = statusLines.Average(x => x.SPR_TAMMINUTES);
            var avgEKM = statusLines.Average(x => x.SPR_EKMMINUTES);
            var avgBEK = statusLines.Average(x => x.SPR_BEKMINUTES);
            var avgOB = statusLines.Average(x => x.SPR_OBMINUTES);

            var statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Servis Talebi Onay Bekliyor";
            statusAvgRow["AVG"] = avgOB;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgOB / 1440) + " Gün " + Convert.ToInt32((avgOB % 1440) / 60) + " Saat " + Convert.ToInt32(avgOB % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);

            statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Talep Edildi";
            statusAvgRow["AVG"] = avgT;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgT / 1440) + " Gün " + Convert.ToInt32((avgT % 1440) / 60) + " Saat " + Convert.ToInt32(avgT % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);

            statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Plan Bekliyor";
            statusAvgRow["AVG"] = avgA;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgA / 1440) + " Gün " + Convert.ToInt32((avgA % 1440) / 60) + " Saat " + Convert.ToInt32(avgA % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);

            statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Planlandı / Atandı";
            statusAvgRow["AVG"] = avgPA;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgPA / 1440) + " Gün " + Convert.ToInt32((avgPA % 1440) / 60) + " Saat " + Convert.ToInt32(avgPA % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);

            statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Beklemede";
            statusAvgRow["AVG"] = avgBEK;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgBEK / 1440) + " Gün " + Convert.ToInt32((avgBEK % 1440) / 60) + " Saat " + Convert.ToInt32(avgBEK % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);

            statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Tamamlandı";
            statusAvgRow["AVG"] = avgTAM;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgTAM / 1440) + " Gün " + Convert.ToInt32((avgTAM % 1440) / 60) + " Saat " + Convert.ToInt32(avgTAM % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);

            statusAvgRow = statusAverageTable.NewRow();
            statusAvgRow["DURUM"] = "Tamamlandı MY";
            statusAvgRow["AVG"] = avgEKM;
            statusAvgRow["AVGTIMES"] = Convert.ToInt32(avgEKM / 1440) + " Gün " + Convert.ToInt32((avgEKM % 1440) / 60) + " Saat " + Convert.ToInt32(avgEKM % 60) + " Dakika";
            statusAverageTable.Rows.Add(statusAvgRow);
            #endregion

            #region holdreasonAvg
            var holdReasonAvgTable = new DataTable("HoldReasonAvg");
            holdReasonAvgTable.Columns.AddRange(new[]
            {
                new DataColumn("HoldReason"),
                new DataColumn("AVG",typeof(int)),
                new DataColumn("AVGTIMES"),
            });

            var avgHak = statusLines.Average(x => x.SPR_HAKEDISMINUTES);
            var avgOp = statusLines.Average(x => x.SPR_OPERASYONMINUTES);
            var avgMus = statusLines.Average(x => x.SPR_MUSTERIYONETIMIMINUTES);
            var avgSat = statusLines.Average(x => x.SPR_SATINALMAMINUTES);

            var holdReasonAvgRow = holdReasonAvgTable.NewRow();
            holdReasonAvgRow["HoldReason"] = "Operasyon";
            holdReasonAvgRow["AVG"] = avgOp;
            holdReasonAvgRow["AVGTIMES"] = Convert.ToInt32(avgOp / 1440) + " Gün " + Convert.ToInt32((avgOp % 1440) / 60) + " Saat " + Convert.ToInt32(avgOp % 60) + " Dakika";
            holdReasonAvgTable.Rows.Add(holdReasonAvgRow);

            holdReasonAvgRow = holdReasonAvgTable.NewRow();
            holdReasonAvgRow["HoldReason"] = "Satınalma";
            holdReasonAvgRow["AVG"] = avgSat;
            holdReasonAvgRow["AVGTIMES"] = Convert.ToInt32(avgSat / 1440) + " Gün " + Convert.ToInt32((avgSat % 1440) / 60) + " Saat " + Convert.ToInt32(avgSat % 60) + " Dakika";
            holdReasonAvgTable.Rows.Add(holdReasonAvgRow);

            holdReasonAvgRow = holdReasonAvgTable.NewRow();
            holdReasonAvgRow["HoldReason"] = "Müşteri Yönetimi";
            holdReasonAvgRow["AVG"] = avgMus;
            holdReasonAvgRow["AVGTIMES"] = Convert.ToInt32(avgMus / 1440) + " Gün " + Convert.ToInt32((avgMus % 1440) / 60) + " Saat " + Convert.ToInt32(avgMus % 60) + " Dakika";
            holdReasonAvgTable.Rows.Add(holdReasonAvgRow);

            holdReasonAvgRow = holdReasonAvgTable.NewRow();
            holdReasonAvgRow["HoldReason"] = "Hakediş";
            holdReasonAvgRow["AVG"] = avgHak;
            holdReasonAvgRow["AVGTIMES"] = Convert.ToInt32(avgHak / 1440) + " Gün " + Convert.ToInt32((avgHak % 1440) / 60) + " Saat " + Convert.ToInt32(avgHak % 60) + " Dakika";
            holdReasonAvgTable.Rows.Add(holdReasonAvgRow);
            #endregion

            #region QuoStateAVG
            var quoStatesAverage = new DataTable("QuoStatesAverage");
            quoStatesAverage.Columns.AddRange(new[]
           {
               new DataColumn("STATE"),
               new DataColumn("AVGTIMES"),
               new DataColumn("AVG",typeof(int)),
           });

            if (quoLines.Count > 0) 
            {

                var B1Average = quoLines.Average(x => x.QSP_B1MINUTES);
                var B2Average = quoLines.Average(x => x.QSP_B2MINUTES);
                var B3Average = quoLines.Average(x => x.QSP_PAMINUTES);
                var BYAverage = quoLines.Average(x => x.QSP_BYMINUTES);
                var HAverage = quoLines.Average(x => x.QSP_HMINUTES);
                var H2Average = quoLines.Average(x => x.QSP_H2MINUTES);
                var RAverage = quoLines.Average(x => x.QSP_RMINUTES);
                var SAAverage = quoLines.Average(x => x.QSP_SAMINUTES);

                var quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Açık";
                quoStatesAverageRow["AVG"] = RAverage;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(RAverage / 1440) + " Gün " + Convert.ToInt32((RAverage % 1440) / 60) + " Saat " + Convert.ToInt32(RAverage % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Çözüm Ortağından Teklif Bekleniyor";
                quoStatesAverageRow["AVG"] = B1Average;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(B1Average / 1440) + " Gün " + Convert.ToInt32((B1Average % 1440) / 60) + " Saat " + Convert.ToInt32(B1Average % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Çözüm Ortağı Teklifi Hazır";
                quoStatesAverageRow["AVG"] = HAverage;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(HAverage / 1440) + " Gün " + Convert.ToInt32((HAverage % 1440) / 60) + " Saat " + Convert.ToInt32(HAverage % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Teklif Maliyeti Hazır";
                quoStatesAverageRow["AVG"] = H2Average;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(H2Average / 1440) + " Gün " + Convert.ToInt32((H2Average % 1440) / 60) + " Saat " + Convert.ToInt32(H2Average % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Teklif Maliyeti Hazır (Kabul Edildi)";
                quoStatesAverageRow["AVG"] = B2Average;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(B2Average / 1440) + " Gün " + Convert.ToInt32((B2Average % 1440) / 60) + " Saat " + Convert.ToInt32(B2Average % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "BY Kontrol Ediyor";
                quoStatesAverageRow["AVG"] = BYAverage;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(BYAverage / 1440) + " Gün " + Convert.ToInt32((BYAverage % 1440) / 60) + " Saat " + Convert.ToInt32(BYAverage % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Satın Alma Onayını Bekliyor";
                quoStatesAverageRow["AVG"] = SAAverage;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(SAAverage / 1440) + " Gün " + Convert.ToInt32((SAAverage % 1440) / 60) + " Saat " + Convert.ToInt32(SAAverage % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
                quoStatesAverageRow = quoStatesAverage.NewRow();
                quoStatesAverageRow["STATE"] = "Müşteri Onayı Bekleniyor";
                quoStatesAverageRow["AVG"] = B3Average;
                quoStatesAverageRow["AVGTIMES"] = Convert.ToInt32(B3Average / 1440) + " Gün " + Convert.ToInt32((B3Average % 1440) / 60) + " Saat " + Convert.ToInt32(B3Average % 60) + " Dakika";
                quoStatesAverage.Rows.Add(quoStatesAverageRow);
            };
            #endregion


            ds.Tables.Add(wpr.StatusLines(statusLines));
            ds.Tables.Add(wpr.QuoLines(quoLines));
            ds.Tables.Add(statusAverageTable);
            ds.Tables.Add(holdReasonAvgTable);
            ds.Tables.Add(paramTable);
            ds.Tables.Add(quoStatesAverage);

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("WPR_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }

        [HttpPost]
        public ActionResult GenerateSIN(SIVParameters p)
        {
            var sin = new SIN();
            var reportFile = "\\Reports\\SatisFaturasi.rpt";

            var repositorySalesInvoices = new RepositorySalesInvoices();
            var repositoryProgressPayments = new RepositoryProgressPayments();
            var repositoryReturnLines = new RepositorySalesInvoiceReturnLines();
            var salesInvoice = repositorySalesInvoices.Get(p.SalesInvoiceId);
            var grLines = new GridRequest
            {
                loadall = true,
                filter = new GridFilters { Filters = new List<GridFilter>() },
                sort = new List<GridSort>()
            };

            IList<TMSALESINVOICELINESVIEW> lines = null;
            IList<TMSALESINVOICERETURNLINESVIEW> returnLines = null;

            if (salesInvoice.SIV_TYPE == "SATIS")
            {
                grLines.filter.Filters.Add(new GridFilter
                { Field = "PSP_SALESINVOICE", Operator = "eq", Value = salesInvoice.SIV_CODE });
                lines = repositoryProgressPayments.ListSalesInvoiceLines(grLines);
            }
            else if (salesInvoice.SIV_TYPE == "IADE")
            {
                grLines.filter.Filters.Add(new GridFilter
                { Field = "PSP_SALESINVOICE", Operator = "in", Value = new JArray(salesInvoice.SIV_SALESINVOICE.Split(',')) });

                returnLines = repositoryProgressPayments.ListSalesInvoiceReturnLines(grLines);
                lines = new List<TMSALESINVOICELINESVIEW>();
                foreach (var returnLine in returnLines)
                {
                    lines.Add(new TMSALESINVOICELINESVIEW()
                    {
                        PSP_TASK = returnLine.PSP_TASK,
                        PSP_BRANCH = returnLine.PSP_BRANCH,
                        PSP_BRANCHDESC = returnLine.PSP_BRANCHDESC,
                        PSP_BRANCHPM = returnLine.PSP_BRANCHPM,
                        PSP_BRANCHREGION = returnLine.PSP_BRANCHREGION,
                        PSP_CATEGORY = returnLine.PSP_CATEGORY,
                        PSP_CATEGORYDESC = returnLine.PSP_CATEGORYDESC,
                        PSP_CODE = returnLine.PSP_CODE,
                        PSP_CREATED = returnLine.PSP_CREATED,
                        PSP_CREATEDBY = returnLine.PSP_CREATEDBY,
                        PSP_CUSTOMER = returnLine.PSP_CUSTOMER,
                        PSP_CUSTOMERDESC = returnLine.PSP_CUSTOMERDESC,
                        PSP_CUSTOMERPM = returnLine.PSP_CUSTOMERPM,
                        PSP_DESC = returnLine.PSP_DESC,
                        PSP_INVOICEDATE = returnLine.PSP_INVOICEDATE,
                        PSP_INVOICENO = returnLine.PSP_INVOICENO,
                        PSP_ORG = returnLine.PSP_ORG,
                        PSP_ORGCURR = returnLine.PSP_ORGCURR,
                        PSP_RECORDVERSION = returnLine.PSP_RECORDVERSION,
                        PSP_SALESINVOICEISRETURNED = returnLine.PSP_SALESINVOICEISRETURNED,
                        PSP_STATUS = returnLine.PSP_STATUS,
                        PSP_STATUSDESC = returnLine.PSP_STATUSDESC,
                        PSP_TASKTYPE = returnLine.PSP_TASKTYPE,
                        PSP_TASKTYPEENTITY = returnLine.PSP_TASKTYPEENTITY,
                        PSP_TOTAL = returnLine.PSP_RETURNTOTAL,
                        PSP_TSKCLOSED = returnLine.PSP_TSKCLOSED,
                        PSP_TSKCOMPLETED = returnLine.PSP_TSKCLOSED,
                        PSP_TSKDEPARTMENT = returnLine.PSP_TSKDEPARTMENT,
                        PSP_TSKREFERENCE = returnLine.PSP_TSKREFERENCE,
                        PSP_TSKTASKTYPE = returnLine.PSP_TSKTASKTYPE,
                        PSP_TSKTYPEDESC = returnLine.PSP_TSKTYPEDESC,
                        PSP_TYPE = returnLine.PSP_TYPE,
                        PSP_TYPEENTITY = returnLine.PSP_TYPEENTITY,
                        PSP_UPDATED = returnLine.PSP_UPDATED,
                        PSP_UPDATEDBY = returnLine.PSP_UPDATEDBY,
                        PSP_SALESINVOICE = salesInvoice.SIV_SALESINVOICE
                    });
                }

            }

            if (lines == null || lines.Count == 0)
            {
                throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
            }

            var ds = new DataSet("VS");
            ds.Tables.Add(sin.Header(salesInvoice));
            ds.Tables.Add(sin.Lines(salesInvoice,lines));

            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SIN_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }
        [HttpPost]
        public ActionResult PrintAllSIV(List<int> p)
        {
            var sin = new SIN();
            var reportFile = "\\Reports\\SatisFaturasi.rpt";
            var repositorySalesInvoices = new RepositorySalesInvoices();
            var repositoryProgressPayments = new RepositoryProgressPayments();
            var repositoryReturnLines = new RepositorySalesInvoiceReturnLines();
            var lstream = new List<Stream>();

            foreach (var salesinvoice in p)
            {
                var salesInvoice = repositorySalesInvoices.Get(salesinvoice);
                var grLines = new GridRequest
                {
                    loadall = true,
                    filter = new GridFilters { Filters = new List<GridFilter>() },
                    sort = new List<GridSort>()
                };

                IList<TMSALESINVOICELINESVIEW> lines = null;
                IList<TMSALESINVOICERETURNLINESVIEW> returnLines = null;

                if (salesInvoice.SIV_TYPE == "SATIS")
                {
                    grLines.filter.Filters.Add(new GridFilter
                    { Field = "PSP_SALESINVOICE", Operator = "eq", Value = salesInvoice.SIV_CODE });
                    lines = repositoryProgressPayments.ListSalesInvoiceLines(grLines);
                }
                else if (salesInvoice.SIV_TYPE == "IADE")
                {
                    grLines.filter.Filters.Add(new GridFilter
                    { Field = "PSP_SALESINVOICE", Operator = "in", Value = new JArray(salesInvoice.SIV_SALESINVOICE.Split(',')) });

                    returnLines = repositoryProgressPayments.ListSalesInvoiceReturnLines(grLines);
                    lines = new List<TMSALESINVOICELINESVIEW>();
                    foreach (var returnLine in returnLines)
                    {
                        lines.Add(new TMSALESINVOICELINESVIEW()
                        {
                            PSP_TASK = returnLine.PSP_TASK,
                            PSP_BRANCH = returnLine.PSP_BRANCH,
                            PSP_BRANCHDESC = returnLine.PSP_BRANCHDESC,
                            PSP_BRANCHPM = returnLine.PSP_BRANCHPM,
                            PSP_BRANCHREGION = returnLine.PSP_BRANCHREGION,
                            PSP_CATEGORY = returnLine.PSP_CATEGORY,
                            PSP_CATEGORYDESC = returnLine.PSP_CATEGORYDESC,
                            PSP_CODE = returnLine.PSP_CODE,
                            PSP_CREATED = returnLine.PSP_CREATED,
                            PSP_CREATEDBY = returnLine.PSP_CREATEDBY,
                            PSP_CUSTOMER = returnLine.PSP_CUSTOMER,
                            PSP_CUSTOMERDESC = returnLine.PSP_CUSTOMERDESC,
                            PSP_CUSTOMERPM = returnLine.PSP_CUSTOMERPM,
                            PSP_DESC = returnLine.PSP_DESC,
                            PSP_INVOICEDATE = returnLine.PSP_INVOICEDATE,
                            PSP_INVOICENO = returnLine.PSP_INVOICENO,
                            PSP_ORG = returnLine.PSP_ORG,
                            PSP_ORGCURR = returnLine.PSP_ORGCURR,
                            PSP_RECORDVERSION = returnLine.PSP_RECORDVERSION,
                            PSP_SALESINVOICEISRETURNED = returnLine.PSP_SALESINVOICEISRETURNED,
                            PSP_STATUS = returnLine.PSP_STATUS,
                            PSP_STATUSDESC = returnLine.PSP_STATUSDESC,
                            PSP_TASKTYPE = returnLine.PSP_TASKTYPE,
                            PSP_TASKTYPEENTITY = returnLine.PSP_TASKTYPEENTITY,
                            PSP_TOTAL = returnLine.PSP_RETURNTOTAL,
                            PSP_TSKCLOSED = returnLine.PSP_TSKCLOSED,
                            PSP_TSKCOMPLETED = returnLine.PSP_TSKCLOSED,
                            PSP_TSKDEPARTMENT = returnLine.PSP_TSKDEPARTMENT,
                            PSP_TSKREFERENCE = returnLine.PSP_TSKREFERENCE,
                            PSP_TSKTASKTYPE = returnLine.PSP_TSKTASKTYPE,
                            PSP_TSKTYPEDESC = returnLine.PSP_TSKTYPEDESC,
                            PSP_TYPE = returnLine.PSP_TYPE,
                            PSP_TYPEENTITY = returnLine.PSP_TYPEENTITY,
                            PSP_UPDATED = returnLine.PSP_UPDATED,
                            PSP_UPDATEDBY = returnLine.PSP_UPDATEDBY,
                            PSP_SALESINVOICE = salesInvoice.SIV_SALESINVOICE
                        });
                    }

                }

                if (lines == null || lines.Count == 0)
                {
                    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));
                }

                var ds = new DataSet("VS");
                ds.Tables.Add(sin.Header(salesInvoice));
                ds.Tables.Add(sin.Lines(salesInvoice,lines));

                var rptH = new ReportDocument();
                rptH.Load(Server.MapPath(reportFile));
                rptH.SetDataSource(ds);

                var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                lstream.Add(stream);
                rptH.Close();
                rptH.Dispose();

            }

            var outputDocument = new PdfDocument();

            foreach (var file in lstream)
            {
                // Attention: must be in Import mode
                var mode = PdfDocumentOpenMode.Import;
                var inputDocument = PdfReader.Open(file, mode);

                var totalPages = inputDocument.PageCount;
                for (var pageNo = 0; pageNo < totalPages; pageNo++)
                {
                    // Get the page from the input document...
                    var page = inputDocument.Pages[pageNo];

                    // ...and copy it to the output document.
                    outputDocument.AddPage(page);
                }
            }

            byte[] pdfData;
            using (var ms = new MemoryStream())
            {
                outputDocument.Save(ms);
                pdfData = ms.ToArray();
            }
            Stream outputStream = new MemoryStream(pdfData);
            return File(outputStream, "application/pdf");
        }

        [HttpPost]
        public ActionResult GenerateTSK(TSKParameters p)
        {
            var tsk = new TSK();
            var reportFile = "\\Reports\\Task.rpt";
             
            var repositoryTasks = new RepositoryTasks();
            var previewHeader = repositoryTasks.PrintView(p.TaskId);

            var ds = new DataSet("VS");
            ds.Tables.Add(tsk.Header(previewHeader));
            ds.Tables.Add(tsk.PricingLines(p));
            ds.Tables.Add(tsk.BookedLines(p));
            ds.Tables.Add(tsk.Signature(p));
            ds.Tables.Add(tsk.Comments(p));
            var rptH = new ReportDocument();
            rptH.Load(Server.MapPath(reportFile));
            rptH.SetDataSource(ds);

            switch (p.Type)
            {
                case "PDF":
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
                case "XLS":
                    {
                        var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
                        rptH.ExportOptions.FormatOptions = efo;
                        var stream = rptH.ExportToStream(ExportFormatType.Excel);
                        return File(stream, "application/vnd.ms-excel",
                            string.Format("SIN_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now));
                    }
                default:
                    {
                        var stream = rptH.ExportToStream(ExportFormatType.PortableDocFormat);
                        return File(stream, "application/pdf");
                    }
            }
        }
    }
}