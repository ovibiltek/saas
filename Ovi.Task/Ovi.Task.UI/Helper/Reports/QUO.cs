using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Quotation;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;

namespace Ovi.Task.UI.Helper.Reports
{
    public class QUO
    {
        public DataTable QuotationLines(IList<TMQUOTATIONLINESVIEW> lines, TMQUOTATIONSVIEW quotation)
        {
            var dtQuotationLines = new DataTable("Lines");
            dtQuotationLines.Columns.AddRange(new[]
            {
                new DataColumn("NO", typeof(long)),
                new DataColumn("DESCRIPTION"),
                new DataColumn("BRAND"),
                new DataColumn("UOM"),
                new DataColumn("REFERENCE"),
                new DataColumn("QUANTITY",typeof(decimal)),
                new DataColumn("UNITPRICE",typeof(decimal)),
                new DataColumn("TOTAL",typeof(decimal)),
                new DataColumn("CURRENCY"),
                new DataColumn("EXCH",typeof(decimal))
            });

            dtQuotationLines.Columns["BRAND"].AllowDBNull = true;
            dtQuotationLines.Columns["REFERENCE"].AllowDBNull = true;
            dtQuotationLines.Columns["UNITPRICE"].AllowDBNull = true;
            dtQuotationLines.Columns["TOTAL"].AllowDBNull = true;
            dtQuotationLines.Columns["CURRENCY"].AllowDBNull = true;
            dtQuotationLines.Columns["EXCH"].AllowDBNull = true;

            foreach (var linei in lines)
            {
                var lineRow = dtQuotationLines.NewRow();
                lineRow["NO"] = linei.QLN_NO;
                lineRow["DESCRIPTION"] = linei.QLN_DESCRIPTION;
                lineRow["BRAND"] = linei.QLN_BRAND;
                lineRow["UOM"] = linei.QLN_UOM;
                lineRow["REFERENCE"] = linei.QLN_REFERENCE;
                lineRow["QUANTITY"] = linei.QLN_QUANTITY;
                lineRow["UNITPRICE"] = linei.QLN_UNITPRICE.HasValue ? (object)linei.QLN_UNITPRICE.Value : DBNull.Value;
                lineRow["TOTAL"] = linei.QLN_TOTALPRICE.HasValue ? (object)linei.QLN_TOTALPRICE.Value : DBNull.Value;
                lineRow["CURRENCY"] = !string.IsNullOrEmpty(linei.QLN_CURR) ? (object)linei.QLN_CURR : DBNull.Value;
                lineRow["EXCH"] = linei.QLN_EXCH.HasValue ? (object)linei.QLN_EXCH.Value : DBNull.Value;

                dtQuotationLines.Rows.Add(lineRow);
            }
            return dtQuotationLines;
        }

        public DataTable QuotationLines2(IList<QUOTATIONFORMAT2> lines)
        {
            var dtQuotationLines = new DataTable("LinesFormat2");
            dtQuotationLines.Columns.AddRange(new[]
            {
                new DataColumn("REFERENCE"),
                new DataColumn("PARTDESC"),
                new DataColumn("SERVICEDESC"),
                new DataColumn("SERVICEUNIT",typeof(decimal)),
                new DataColumn("PARTUNIT",typeof(decimal)),
                new DataColumn("QTY",typeof(decimal)),
                new DataColumn("SERVICETOTAL",typeof(decimal)),
                new DataColumn("PARTTOTAL",typeof(decimal)),
                new DataColumn("GRANDTOTAL",typeof(decimal)),
                new DataColumn("CURR"),
                new DataColumn("DESC")
            });


            foreach (var linei in lines)
            {
                var servicedesc = !String.IsNullOrEmpty(linei.QUO_SERVICEDESC)
                    ? (linei.QUO_SERVICEDESC.Length > 50 ? linei.QUO_SERVICEDESC.Substring(0, 50) + ".. " :
                    linei.QUO_SERVICEDESC) : "";

                var partdesc = !String.IsNullOrEmpty(linei.QUO_PARTDESC)  ? ((linei.QUO_PARTDESC.Length > 50 ? "- " +linei.QUO_PARTDESC.Substring(0, 50)+".. " :
                    "- " + linei.QUO_PARTDESC)) : "";

                var lineRow = dtQuotationLines.NewRow();
                lineRow["REFERENCE"] = linei.QUO_REF;
                lineRow["PARTDESC"] = linei.QUO_PARTDESC;
                lineRow["SERVICEDESC"] = linei.QUO_SERVICEDESC;
                lineRow["SERVICEUNIT"] = linei.QUO_SERVICEUNIT;
                lineRow["PARTUNIT"] = linei.QUO_PARTUNIT;
                lineRow["QTY"] = linei.QUO_QTY;
                lineRow["SERVICETOTAL"] = linei.QUO_SERVICETOTAL;
                lineRow["PARTTOTAL"] = linei.QUO_PARTOTAL;
                lineRow["GRANDTOTAL"] = linei.QUO_SERVICETOTAL + linei.QUO_PARTOTAL;
                lineRow["CURR"] = linei.QUO_CURR;
                lineRow["DESC"] = servicedesc  + partdesc ;

                dtQuotationLines.Rows.Add(lineRow);
            }
            return dtQuotationLines;
        }

        public DataTable QuotationHeader(TMQUOTATIONSVIEW quotation)
        {
            var dtHeader = new DataTable("Header");
            dtHeader.Columns.AddRange(new[]
            {
                new DataColumn("TSKID", typeof(long)),
                new DataColumn("TASKSTR"),
                new DataColumn("ACTIVITY",typeof(long)),
                new DataColumn("DATE",typeof(DateTime)),
                new DataColumn("OFFER",typeof(long)),
                new DataColumn("OFFERSTR"),
                new DataColumn("SUBJECT"),
                new DataColumn("CURR"),
                new DataColumn("EXCH",typeof(decimal)),
                new DataColumn("VALIDITYPERIOD",typeof(int)),
                new DataColumn("ACTSCHTO",typeof(DateTime))

            });

            dtHeader.Columns["TASKSTR"].AllowDBNull = true;
            dtHeader.Columns["TSKID"].AllowDBNull = true;
            dtHeader.Columns["ACTIVITY"].AllowDBNull = true;
            dtHeader.Columns["VALIDITYPERIOD"].AllowDBNull = true;
            dtHeader.Columns["ACTSCHTO"].AllowDBNull = true;


            var repHeaderRow = dtHeader.NewRow();
            repHeaderRow["TSKID"] = quotation.QUO_TASK.HasValue ? (object)quotation.QUO_TASK.Value : DBNull.Value;
            repHeaderRow["TASKSTR"] = quotation.QUO_TASK.HasValue ? (object)string.Format("{0}{1}", quotation.QUO_TASK.Value, (quotation.QUO_ACTIVITY.HasValue ? ("/" + quotation.QUO_ACTIVITY) : "")) : DBNull.Value;
            repHeaderRow["ACTIVITY"] = quotation.QUO_ACTIVITY.HasValue ? (object)quotation.QUO_ACTIVITY.Value : DBNull.Value;
            repHeaderRow["DATE"] = DateTime.Now;
            repHeaderRow["OFFER"] = quotation.QUO_ID;
            repHeaderRow["OFFERSTR"] = string.Format("{0}.R{1}", quotation.QUO_ID, quotation.QUO_REVNO);
            repHeaderRow["SUBJECT"] = quotation.QUO_DESCRIPTION;
            repHeaderRow["CURR"] = quotation.QUO_CURR;
            repHeaderRow["EXCH"] = quotation.QUO_EXCH;
            repHeaderRow["VALIDITYPERIOD"] = quotation.QUO_VALIDITYPERIOD.HasValue ? (object)quotation.QUO_VALIDITYPERIOD.Value : DBNull.Value;
            repHeaderRow["ACTSCHTO"] = quotation.QUO_ACTSCHTO.HasValue ? (object)quotation.QUO_ACTSCHTO.Value : DBNull.Value;

            dtHeader.Rows.Add(repHeaderRow);
            return dtHeader;
        }

        public DataTable QuotationTotal(IList<TMQUOTATIONLINESVIEW> lines)
        {
            RepositoryExchRates repositoryExchRates = new RepositoryExchRates();

            var dtQuotationTotal = new DataTable("Totals");
            dtQuotationTotal.Columns.AddRange(new[]
            {
                new DataColumn("TL", typeof(decimal)),
                new DataColumn("EUR", typeof(decimal)),
                new DataColumn("USD", typeof(decimal)),
                new DataColumn("GBP", typeof(decimal)),
                new DataColumn("GRANDTOTALASTL", typeof(decimal)),
                new DataColumn("EUREXCH", typeof(decimal)),
                new DataColumn("USDEXCH", typeof(decimal)),
                new DataColumn("GBPEXCH", typeof(decimal))
            });

            dtQuotationTotal.Columns["TL"].AllowDBNull = true;
            dtQuotationTotal.Columns["EUR"].AllowDBNull = true;
            dtQuotationTotal.Columns["USD"].AllowDBNull = true;
            dtQuotationTotal.Columns["GBP"].AllowDBNull = true;
            dtQuotationTotal.Columns["GRANDTOTALASTL"].AllowDBNull = true;
            dtQuotationTotal.Columns["EUREXCH"].AllowDBNull = true;
            dtQuotationTotal.Columns["USDEXCH"].AllowDBNull = true;
            dtQuotationTotal.Columns["GBPEXCH"].AllowDBNull = true;

            var TL = lines.Where(x=>x.QLN_CURR == "TL").Sum(x=>x.QLN_TOTALPRICE) ?? 0;
            var EUR = lines.Where(x => x.QLN_CURR == "EUR").Sum(x => x.QLN_TOTALPRICE) ?? 0;
            var USD = lines.Where(x => x.QLN_CURR == "USD").Sum(x => x.QLN_TOTALPRICE) ?? 0;
            var GBP = lines.Where(x => x.QLN_CURR == "GBP").Sum(x => x.QLN_TOTALPRICE) ?? 0;

            var EUREXCH = repositoryExchRates.GetLatestExchRate(new TMEXCHRATES() { CRR_BASECURR = "TL", CRR_CURR = "EUR" });
            var USDEXCH = repositoryExchRates.GetLatestExchRate(new TMEXCHRATES() { CRR_BASECURR = "TL", CRR_CURR = "USD" });
            var GBPEXCH = repositoryExchRates.GetLatestExchRate(new TMEXCHRATES() { CRR_BASECURR = "TL", CRR_CURR = "GBP" });

            var GRANDTOTAL = TL + (EUR * EUREXCH.CRR_EXCH) + (USD * USDEXCH.CRR_EXCH) + (GBP * GBPEXCH.CRR_EXCH);

            var repToRow = dtQuotationTotal.NewRow();
            repToRow["TL"] = TL;
            repToRow["EUR"] = EUR;
            repToRow["USD"] = USD;
            repToRow["GBP"] = GBP;
            repToRow["GRANDTOTALASTL"] = GRANDTOTAL;
            repToRow["EUREXCH"] = EUREXCH.CRR_EXCH;
            repToRow["USDEXCH"] = USDEXCH.CRR_EXCH;
            repToRow["GBPEXCH"] = GBPEXCH.CRR_EXCH;

            dtQuotationTotal.Rows.Add(repToRow);
            return dtQuotationTotal;
        }

        public DataTable QuotationTo(TMQUOTATIONSVIEW quotation)
        {
            var repositoryCustomers = new RepositoryCustomers();
            var customer = repositoryCustomers.Get(quotation.QUO_CUSTOMER);

            if (customer == null)
                throw new TmsException(string.Format(MessageHelper.Get("30003", UserManager.Instance.User.Language), quotation.QUO_CUSTOMER));

            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            var customfieldvalues = repositoryCustomFieldValues.GetBySubjectAndSource("QUOTATION", quotation.QUO_ID.ToString());

            var dtTo = new DataTable("To");
            dtTo.Columns.AddRange(new[]
            {
                new DataColumn("COMPANY"),
                new DataColumn("BRANCH"),
                new DataColumn("NAME"),
                new DataColumn("EMAIL"),
                new DataColumn("PHONE"),
                new DataColumn("FAX"),
            });

            var repToRow = dtTo.NewRow();
            repToRow["COMPANY"] = quotation.QUO_CUSTOMERDESC;
            repToRow["BRANCH"] = quotation.QUO_BRANCHDESC;
            repToRow["NAME"] = (customfieldvalues != null && customfieldvalues.Any(x => x.CFV_CODE == "T-ISIM") ? customfieldvalues.Single(x => x.CFV_CODE == "T-ISIM").CFV_TEXT : customer.CUS_CONTACTPERSON01);
            repToRow["EMAIL"] = (customfieldvalues != null && customfieldvalues.Any(x => x.CFV_CODE == "T-MAIL") ? customfieldvalues.Single(x => x.CFV_CODE == "T-MAIL").CFV_TEXT : customer.CUS_CSR);
            repToRow["PHONE"] = (customfieldvalues != null && customfieldvalues.Any(x => x.CFV_CODE == "T-TEL") ? customfieldvalues.Single(x => x.CFV_CODE == "T-TEL").CFV_TEXT : customer.CUS_PHONE01);
            repToRow["FAX"] = (customfieldvalues != null && customfieldvalues.Any(x => x.CFV_CODE == "T-FAX") ? customfieldvalues.Single(x => x.CFV_CODE == "T-FAX").CFV_TEXT : customer.CUS_FAX);

            if (quotation.QUO_TASK.HasValue)
            {
                var repositoryTasks = new RepositoryTasks();
                var task = repositoryTasks.Get(quotation.QUO_TASK.Value);
                var branch = new RepositoryBranches().Get(task.TSK_BRANCH);
            }

            dtTo.Rows.Add(repToRow);
            return dtTo;
        }

        public DataTable QuotationFrom(TMQUOTATIONSVIEW quotation)
        {
            var repositoryUsers = new RepositoryUsers();
            var repositoryParameters = new RepositoryParameters();

            if (string.IsNullOrEmpty(quotation.QUO_PM))
            {
                throw new TmsException(string.Format(MessageHelper.Get("30071", UserManager.Instance.User.Language), quotation.QUO_CUSTOMER));
            }
            var user = repositoryUsers.Get(quotation.QUO_PM);
            if (user == null)
                throw new TmsException(string.Format(MessageHelper.Get("30004", UserManager.Instance.User.Language), quotation.QUO_CUSTOMER));

            var phone = repositoryParameters.Get("COMPANYPHONE");
            var fax = repositoryParameters.Get("COMPANYFAX");

            var dtFrom = new DataTable("From");
            dtFrom.Columns.AddRange(new[]
            {
                new DataColumn("NAME"),
                new DataColumn("EMAIL"),
                new DataColumn("PHONE"),
                new DataColumn("FAX"),
            });

            var repFromRow = dtFrom.NewRow();
            repFromRow["NAME"] = quotation.QUO_PMDESC;
            repFromRow["EMAIL"] = user.USR_EMAIL;
            repFromRow["PHONE"] = user.USR_OFFICENUMBER;
            repFromRow["FAX"] = fax != null ? fax.PRM_VALUE : "";

            dtFrom.Rows.Add(repFromRow);
            return dtFrom;
        }

        public  DataTable QuotationDescriptions(TMQUOTATIONSVIEW quotation)
        {
            var dtDescriptions = new DataTable("Descriptions");
            dtDescriptions.Columns.AddRange(new[]
            {
                new DataColumn("T-DAHIL"),
                new DataColumn("T-HARIC"),
                new DataColumn("T-OPSIYON"),
                new DataColumn("T-TESLIM"),
                new DataColumn("T-ODEME"),
                new DataColumn("T-GARANTI"),
                new DataColumn("T-ACIKLAMA")

            });


            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            var customfieldvalues = repositoryCustomFieldValues.GetBySubjectAndSource("QUOTATION", quotation.QUO_ID.ToString());

            if (customfieldvalues != null && customfieldvalues.Count > 0)
            {
                var t_dahil = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-DAHIL");
                var t_haric = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-HARIC");
                var t_opsiyon = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-OPSIYON");
                var t_teslim = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-TESLIM");
                var t_odeme = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-ODEME");
                var t_garanti = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-GARANTI");
                var t_aciklama = customfieldvalues.SingleOrDefault(x => x.CFV_CODE == "T-ACIKLAMA");


                var repDescRow = dtDescriptions.NewRow();
                repDescRow["T-DAHIL"] = t_dahil != null ? t_dahil.CFV_TEXT : "";
                repDescRow["T-HARIC"] = t_haric != null ? t_haric.CFV_TEXT : "";
                repDescRow["T-OPSIYON"] = t_opsiyon != null ? t_opsiyon.CFV_TEXT : "";
                repDescRow["T-TESLIM"] = t_teslim != null ? t_teslim.CFV_TEXT : "";
                repDescRow["T-ODEME"] = t_odeme != null ? t_odeme.CFV_TEXT : "";
                repDescRow["T-GARANTI"] = t_garanti != null ? t_garanti.CFV_TEXT : "";
                repDescRow["T-ACIKLAMA"] = t_aciklama != null ? t_aciklama.CFV_TEXT : "";


                dtDescriptions.Rows.Add(repDescRow);
            }

            return dtDescriptions;
        }
    }
}