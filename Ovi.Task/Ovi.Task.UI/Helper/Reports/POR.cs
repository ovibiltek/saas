using System;
using System.Collections.Generic;
using Ovi.Task.Data.Entity;
using System.Data;

namespace Ovi.Task.UI.Helper.Reports
{
    public class POR
    {
        public DataTable PurchaseOrderHeader(TMPURCHASEORDERS purchaseOrder)
        {
            var dtHeader = new DataTable("Header");
            dtHeader.Columns.AddRange(new[]
            {
                new DataColumn("PORID", typeof(long)),
                new DataColumn("REQUESTDATE",typeof(DateTime)),
                //ALICI
                new DataColumn("SUPDESC"),
                new DataColumn("SUPAUTH"),
                new DataColumn("SUPMAIL"),
                new DataColumn("SUPPHONE"),
                new DataColumn("SUPFAX"),
                new DataColumn("DELIVERYADR"),
                new DataColumn("SUPPAYTERM",typeof(int)),
                //GÖNDEREN
                new DataColumn("REQBY"),
                new DataColumn("REQMAIL"),
                //KONU
                new DataColumn("PODESC")
            });

           
            dtHeader.Columns["SUPAUTH"].AllowDBNull = true;
            dtHeader.Columns["SUPMAIL"].AllowDBNull = true;
            dtHeader.Columns["SUPPHONE"].AllowDBNull = true;
            dtHeader.Columns["SUPFAX"].AllowDBNull = true;
            dtHeader.Columns["SUPPAYTERM"].AllowDBNull = true;

            var repHeaderRow = dtHeader.NewRow();
            repHeaderRow["PORID"] = purchaseOrder.POR_ID;
            repHeaderRow["REQUESTDATE"] = purchaseOrder.POR_REQUESTED;
            repHeaderRow["SUPDESC"] = purchaseOrder.POR_SUPPLIERDESC;
            repHeaderRow["SUPAUTH"] = purchaseOrder.POR_SUPPLIERAUTH;
            repHeaderRow["SUPMAIL"] = purchaseOrder.POR_SUPPLIERMAIL;
            repHeaderRow["SUPPHONE"] = purchaseOrder.POR_SUPPLIERPHONE;
            repHeaderRow["SUPFAX"] = purchaseOrder.POR_SUPPLIERFAX;
            repHeaderRow["SUPPAYTERM"] = !String.IsNullOrEmpty(purchaseOrder.POR_SUPPAYMENTPERIOD) ? (object)purchaseOrder.POR_SUPPAYMENTPERIOD : DBNull.Value;
            repHeaderRow["DELIVERYADR"] = purchaseOrder.POR_DELIVERYADR;
            repHeaderRow["REQBY"] = purchaseOrder.POR_REQUESTEDBY;
            repHeaderRow["REQMAIL"] = purchaseOrder.POR_REQUESTEDBYEMAIL;
            repHeaderRow["PODESC"] = purchaseOrder.POR_DESCRIPTION;

            dtHeader.Rows.Add(repHeaderRow);
            return dtHeader;
        }

        public DataTable PurchaseOrderLines(IList<TMPURCHASEORDERLINES> lines)
        {
            var dtQuotationLines = new DataTable("Lines");
            dtQuotationLines.Columns.AddRange(new[]
            {
                new DataColumn("NO", typeof(long)),
                new DataColumn("PARTDESCRIPTION"),
                new DataColumn("PARTCODE"),
                new DataColumn("UNIT"),
                new DataColumn("QUANTITY",typeof(decimal)),
                new DataColumn("UNITPRICE",typeof(decimal)),
                new DataColumn("TOTAL",typeof(decimal)),
                new DataColumn("CURRENCY"),
            });

            dtQuotationLines.Columns["TOTAL"].AllowDBNull = true;

            foreach (var linei in lines)
            {
                var lineRow = dtQuotationLines.NewRow();
                decimal? discountedPrice = linei.PRL_UNITPRICE - ((linei.PRL_UNITPRICE * linei.PRL_DISCOUNT) / 100);

                lineRow["NO"] = linei.PRL_LINE;
                lineRow["PARTDESCRIPTION"] = linei.PRL_PARTDESC;
                lineRow["PARTCODE"] = linei.PRL_PARTCODE;
                lineRow["UNIT"] = linei.PRL_REQUESTEDUOM;
                lineRow["QUANTITY"] = linei.PRL_QUANTITY;
                lineRow["UNITPRICE"] = discountedPrice;
                lineRow["TOTAL"] = linei.PRL_QUANTITY * discountedPrice;
                lineRow["CURRENCY"] = linei.PRL_CURRENCY;


                dtQuotationLines.Rows.Add(lineRow);
            }
            return dtQuotationLines;
        }

    }
}