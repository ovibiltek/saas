using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.UI.Helper.Reports
{
    public class SIN
    {
        public DataTable Header(TMSALESINVOICES salesInvoice)
        {
            var dtHeader = new DataTable("Header");
            dtHeader.Columns.AddRange(new[]
            {
                new DataColumn("InvoiceId", typeof(int)),
                new DataColumn("InvoiceType"),
                new DataColumn("Description"),
                new DataColumn("Customer"),
                new DataColumn("InvoiceNo"),
                new DataColumn("InvoiceDate",typeof(DateTime)),
                new DataColumn("InvoiceDesc"),
                new DataColumn("CreatedBy"),
                new DataColumn("Created",typeof(DateTime)),
                new DataColumn("AccountCode"),
                new DataColumn("OrderNo"),
                new DataColumn("LineMessage")
            });

            dtHeader.Columns["InvoiceNo"].AllowDBNull = true;
            dtHeader.Columns["InvoiceDate"].AllowDBNull = true;
            dtHeader.Columns["OrderNo"].AllowDBNull = true;

            var repHeaderRow = dtHeader.NewRow();
            repHeaderRow["InvoiceId"] = salesInvoice.SIV_CODE;
            repHeaderRow["InvoiceType"] = salesInvoice.SIV_TYPE;
            repHeaderRow["Description"] = salesInvoice.SIV_DESC;
            repHeaderRow["Customer"] = salesInvoice.SIV_CUSTOMERDESC;
            repHeaderRow["InvoiceNo"] =  salesInvoice.SIV_INVOICENO;
            repHeaderRow["InvoiceDate"] = salesInvoice.SIV_INVOICEDATE.HasValue ? (object)salesInvoice.SIV_INVOICEDATE : DBNull.Value;
            repHeaderRow["InvoiceDesc"] = salesInvoice.SIV_INVOICEDESCRIPTION;
            repHeaderRow["OrderNo"] =  !String.IsNullOrEmpty(salesInvoice.SIV_ORDERNO) ? (object)salesInvoice.SIV_ORDERNO : DBNull.Value;
            repHeaderRow["Created"] = salesInvoice.SIV_CREATED;
            repHeaderRow["CreatedBy"] = salesInvoice.SIV_CREATEDBY;
            repHeaderRow["AccountCode"] = salesInvoice.SIV_ACCOUNTCODE;
            repHeaderRow["LineMessage"] = salesInvoice.SIV_PRINTTYPE;

            dtHeader.Rows.Add(repHeaderRow);
            return dtHeader;
        }

        public DataTable Lines(TMSALESINVOICES salesInvoice,IList<TMSALESINVOICELINESVIEW> salesInvoiceLines)
        {
            var dtLines = new DataTable("Lines");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("Order", typeof(int)),
                new DataColumn("ProgressPayment", typeof(long)),
                new DataColumn("Description"),
                new DataColumn("BranchDescription"),
                new DataColumn("Category"),
                new DataColumn("Amount",typeof(decimal)),
                new DataColumn("AmountWithInterest",typeof(decimal)),
                new DataColumn("DateCreated",typeof(DateTime)),
                new DataColumn("DateTaskCompleted",typeof(DateTime)),
                new DataColumn("Currency"),


            });
            dtLines.Columns["DateTaskCompleted"].AllowDBNull = true;


            decimal iInterestRate = 0;
            if (salesInvoice.SIV_INTEREST == '+')
            {
                var repositoryParameters = new RepositoryParameters();
                var interestRate = repositoryParameters.Get("INTERESTRATE");
                if (interestRate != null)
                {
                    if (!Parser.ParseDecimal(interestRate.PRM_VALUE, out iInterestRate))
                        throw new Exception(string.Format(MessageHelper.Get("30059", UserManager.Instance.User.Language), interestRate.PRM_VALUE));
                }
            }
           

            int row = 0; 
            foreach (var linei in salesInvoiceLines)
            {
                var lineRow = dtLines.NewRow();

                row++;
                lineRow["Order"] = row;
                lineRow["ProgressPayment"] = linei.PSP_CODE;
                lineRow["Description"] = linei.PSP_DESC;
                lineRow["BranchDescription"] = linei.PSP_BRANCHDESC;
                lineRow["Category"] = linei.PSP_CATEGORYDESC;
                lineRow["Amount"] = linei.PSP_TOTAL;
                lineRow["AmountWithInterest"] = linei.PSP_TOTAL +  (linei.PSP_TOTAL * iInterestRate / 100);
                lineRow["DateCreated"] = linei.PSP_CREATED;
                lineRow["DateTaskCompleted"] = linei.PSP_TSKCOMPLETED.HasValue ? (object)linei.PSP_TSKCOMPLETED : DBNull.Value;
                lineRow["Currency"] = "TL";

                dtLines.Rows.Add(lineRow);
            }

            return dtLines;

        }
    }
}