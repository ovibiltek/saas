using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.UI.Helper.Reports
{
    public class INV
    {
        public DataTable InvoiceLines(IList<TMINVOICELINESVIEW> lines, TMINVOICES invoice)
        {
            var dtInvoiceLines = new DataTable("InvoiceLines");
            dtInvoiceLines.Columns.AddRange(new[]
            {
                new DataColumn("ItemNo", typeof(int)),
                new DataColumn("Task", typeof(long)),
                new DataColumn("TaskDescription"),
                new DataColumn("Activity", typeof(long)),
                new DataColumn("ActivityDescription"),
                new DataColumn("Customer"),
                new DataColumn("CustomerDescription"),
                new DataColumn("Branch"),
                new DataColumn("BranchDescription"),
                new DataColumn("Category"),
                new DataColumn("Created", typeof(DateTime)),
                new DataColumn("Completed", typeof(DateTime)),
                new DataColumn("Closed", typeof(DateTime)),
                new DataColumn("LineTotal", typeof(decimal)),
                new DataColumn("Currency")
            });

            dtInvoiceLines.Columns["LineTotal"].AllowDBNull = true;
            dtInvoiceLines.Columns["Completed"].AllowDBNull = true;
            dtInvoiceLines.Columns["Closed"].AllowDBNull = true;


            var lineno = 1;
            foreach (var linei in lines)
            {

                var lineRow = dtInvoiceLines.NewRow();
                lineRow["ItemNo"] = lineno;
                lineRow["Task"] = linei.TSA_TASK;
                lineRow["TaskDescription"] = linei.TSA_TSKSHORTDESC;
                lineRow["Activity"] = linei.TSA_LINE;
                lineRow["ActivityDescription"] = linei.TSA_DESC;
                lineRow["Customer"] = linei.TSA_TSKCUSTOMER;
                lineRow["CustomerDescription"] = linei.TSA_TSKCUSTOMERDESC;
                lineRow["Branch"] = linei.TSA_TSKBRANCH;
                lineRow["BranchDescription"] = linei.TSA_TSKBRANCHDESC;
                lineRow["Category"] = linei.TSA_TSKCATEGORYDESC;
                lineRow["Created"] = linei.TSA_CREATED;
                lineRow["Completed"] = linei.TSA_DATECOMPLETED.HasValue ? (object)linei.TSA_DATECOMPLETED : DBNull.Value;
                lineRow["Closed"] = linei.TSA_TSKCLOSED.HasValue ? (object)linei.TSA_TSKCLOSED : DBNull.Value;
                lineRow["LineTotal"] = linei.TSA_MSCTOTAL.HasValue ? (object)linei.TSA_MSCTOTAL : DBNull.Value;
                lineRow["Currency"] = invoice.INV_ORGCURR;
                dtInvoiceLines.Rows.Add(lineRow);
                lineno++;
            }

            return dtInvoiceLines;
        }

        public DataTable InvoiceLineDetails(IList<TMINVOICELINESVIEW> lines)
        {
            var dtLineDetails = new DataTable("LineDetails");
            dtLineDetails.Columns.AddRange(new[]
            {
                new DataColumn("Description"),
                new DataColumn("Quantity",typeof(decimal)),
                new DataColumn("Uom"),
                new DataColumn("UnitPrice",typeof(decimal)),
                new DataColumn("Total",typeof(decimal)),
                new DataColumn("Currency"),
                new DataColumn("Date",typeof(DateTime)),
                new DataColumn("Task",typeof(int)),
                new DataColumn("Activity",typeof(int))
            });
            dtLineDetails.Columns["Quantity"].AllowDBNull = true;
            dtLineDetails.Columns["UnitPrice"].AllowDBNull = true;
            dtLineDetails.Columns["Total"].AllowDBNull = true;
            dtLineDetails.Columns["Date"].AllowDBNull = true;
            var repositoryInvoices = new RepositoryInvoices();
            var gr = new GridRequest { loadall = true, filter = new GridFilters { Filters = new List<GridFilter>() } };
            foreach (var line in lines)
            {
                gr.filter.Filters.Clear();
                gr.filter.Filters.Add(new GridFilter{ Field="SIL_TASK",Operator= "eq",Value= line.TSA_TASK });
                gr.filter.Filters.Add(new GridFilter{ Field = "SIL_ACTIVITY", Operator = "eq", Value = line.TSA_LINE });
                var lineDetails = repositoryInvoices.ListLineDetails(gr);
                foreach (var detail in lineDetails)
                {
                    var lineDetailRow = dtLineDetails.NewRow();
                    lineDetailRow["Description"] = detail.SIL_DESC;
                    lineDetailRow["Quantity"] = detail.SIL_QTY;
                    lineDetailRow["Uom"] = detail.SIL_UOM;
                    lineDetailRow["UnitPrice"] = detail.SIL_UNITPRICE;
                    lineDetailRow["Total"] = detail.SIL_TOTAL;
                    lineDetailRow["Currency"] = detail.SIL_CURR;
                    lineDetailRow["Date"] = detail.SIL_DATE;
                    lineDetailRow["Task"] = detail.SIL_TASK;
                    lineDetailRow["Activity"] = detail.SIL_ACTIVITY;
                    dtLineDetails.Rows.Add(lineDetailRow);
                }
               
                
            }

            return dtLineDetails;
        }

        public DataTable InvoiceHeader(TMINVOICES invoice)
        {
            var dtInvoiceHeader = new DataTable("InvoiceHeader");
            dtInvoiceHeader.Columns.AddRange(new[]
            {
                new DataColumn("InvoiceCode", typeof(long)),
                new DataColumn("InvoiceOrderNo"),
                new DataColumn("InvoiceDesc"),
                new DataColumn("InvoiceSupplier"),
                new DataColumn("InvoiceNo"),
                new DataColumn("InvoiceDate", typeof(DateTime)),
                new DataColumn("InvoiceTotal", typeof(decimal)),
                new DataColumn("InvoiceTotalWithInterest", typeof(decimal)),
                new DataColumn("InvoiceCurrency"),
                new DataColumn("InvoicePaymentPeriod")
            });
            dtInvoiceHeader.Columns["InvoiceNo"].AllowDBNull = true;
            dtInvoiceHeader.Columns["InvoiceOrderNo"].AllowDBNull = true;
            dtInvoiceHeader.Columns["InvoiceDate"].AllowDBNull = true;
            dtInvoiceHeader.Columns["InvoicePaymentPeriod"].AllowDBNull = true;
            dtInvoiceHeader.Columns["InvoiceTotal"].AllowDBNull = true;
            dtInvoiceHeader.Columns["InvoiceTotalWithInterest"].AllowDBNull = true;

            decimal iInterestRate = 0;
            if (invoice.INV_INTEREST == '+')
            {
                var repositoryParameters = new RepositoryParameters();
                var interestRate = repositoryParameters.Get("INTERESTRATE");
                if (interestRate != null)
                {
                    if (!Parser.ParseDecimal(interestRate.PRM_VALUE, out iInterestRate))
                        throw new Exception(string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), interestRate.PRM_VALUE));
                }
            }

            var repHeaderRow = dtInvoiceHeader.NewRow();

            repHeaderRow["InvoiceCode"] = invoice.INV_CODE;
            repHeaderRow["InvoiceDesc"] = invoice.INV_DESC;
            repHeaderRow["InvoiceOrderNo"] = !string.IsNullOrEmpty(invoice.INV_ORDERNODESC) ? (object)invoice.INV_ORDERNODESC : DBNull.Value;
            repHeaderRow["InvoiceSupplier"] = invoice.INV_SUPPLIERDESC;
            repHeaderRow["InvoiceNo"] = !string.IsNullOrEmpty(invoice.INV_INVOICE) ? (object)invoice.INV_INVOICE : "";
            repHeaderRow["InvoiceDate"] = invoice.INV_INVOICEDATE.HasValue ? (object)invoice.INV_INVOICEDATE.Value : DBNull.Value;
            repHeaderRow["InvoiceTotal"] = invoice.INV_MATCHEDTOTAL.HasValue ? (object)invoice.INV_MATCHEDTOTAL : DBNull.Value;
            repHeaderRow["InvoiceTotalWithInterest"] = invoice.INV_TOTALWITHINTEREST.HasValue ? (object)invoice.INV_TOTALWITHINTEREST.Value : DBNull.Value;
            repHeaderRow["InvoiceCurrency"] = invoice.INV_ORGCURR;
            repHeaderRow["InvoicePaymentPeriod"] = !string.IsNullOrEmpty(invoice.INV_PAYMENTPERIOD)
                ? (object)invoice.INV_PAYMENTPERIOD
                : DBNull.Value;
            dtInvoiceHeader.Rows.Add(repHeaderRow);
            return dtInvoiceHeader;
        }


        public DataTable InvoiceReturnLines(IList<TMINVOICERETURNLINESDETAILSVIEW> lines, TMINVOICES invoice)
        {
            var dtInvoiceReturnLines = new DataTable("InvoiceReturnLines");
            dtInvoiceReturnLines.Columns.AddRange(new[]
            {
                new DataColumn("OrjInvoiceId", typeof(long)),
                new DataColumn("OrjInvoiceNo"),
                new DataColumn("Task", typeof(long)),
                new DataColumn("Activity", typeof(long)),
                new DataColumn("ItemNo", typeof(int)),
                new DataColumn("Description"),
                new DataColumn("OrjTotalPrice",typeof(decimal)),
                new DataColumn("ReturnPrice",typeof(decimal))
            });

            var lineno = 1;
            foreach (var linei in lines)
            {

                var lineRow = dtInvoiceReturnLines.NewRow();
                lineRow["ItemNo"] = lineno;
                lineRow["OrjInvoiceId"] = linei.SIL_INVOICE;
                lineRow["OrjInvoiceNo"] = linei.SIL_INVOICENO;
                lineRow["Task"] = linei.SIL_TASK;
                lineRow["Activity"] = linei.SIL_ACTIVITY;
                lineRow["Description"] = linei.SIL_DESC;
                lineRow["OrjTotalPrice"] = linei.SIL_TOTAL;
                lineRow["ReturnPrice"] = linei.SIL_ALREADYRETURNED;

                dtInvoiceReturnLines.Rows.Add(lineRow);
                lineno++;
            }

            return dtInvoiceReturnLines;
        }
    }
}