using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Controllers;
using System.IO;
using ICSharpCode.SharpZipLib.Core;
using System.Web.Configuration;

namespace Ovi.Task.UI.Helper.Reports
{
    public class PSP
    {

        public void PSPPricingLines(PSPParameters p, IEnumerable<long> arr, DataTable pricingTable, DataTable pricinSummTable)
        {

            var repositoryProgressPaymentPricing = new RepositoryProgressPaymentPricing();
            var grLines = new GridRequest { loadall = true, filter = new GridFilters { Filters = new List<GridFilter>() } };
            grLines.filter.Filters.Add(new GridFilter { Field = "PRC_TASK", Operator = "in", Value = new JArray(arr.ToArray()) });

            switch (p.Format)
            {
                case "F2":
                case "F3":
                case "F4":
                case "F5":

                    var pricinglines2 = repositoryProgressPaymentPricing.ListReportPricingLines2(grLines);

                    foreach (var plinei in pricinglines2)
                    {
                        var pricingRow = pricingTable.NewRow();
                        pricingRow["TSK"] = plinei.PRC_TASK;
                        pricingRow["ACT"] = plinei.PRC_ACTLINE;
                        pricingRow["ACTDESC"] = string.Format("{0}/{1} Kapanış Notu :{2}", plinei.PRC_ACTLINE,
                            plinei.PRC_ACTDESC, plinei.PRC_ACTNOTE);
                        pricingRow["UNITPRICE"] = plinei.PRC_UNITPRICE;
                        pricingRow["UOM"] = plinei.PRC_UOM;
                        pricingRow["QTY"] = plinei.PRC_QTY;
                        pricingRow["TOTAL"] = plinei.PRC_QTY * plinei.PRC_UNITPRICE;
                        pricingRow["TYPE"] = plinei.PRC_TYPE;
                        pricingRow["SUBTYPE"] = plinei.PRC_SUBTYPE;
                        pricingRow["TYPEDESC"] = plinei.PRC_TYPEDESC;
                        pricingRow["HASQUOTATION"] = plinei.PRC_HASQUOTATION;
                        pricingRow["MAILRECIPIENTS"] = plinei.PRC_MAILRECIPIENTS;

                        if (p.HideZero == '+' && (plinei.PRC_QTY * plinei.PRC_UNITPRICE) == 0)
                            continue;
                        pricingTable.Rows.Add(pricingRow);
                    }

                    if (p.IncludeSecondTable == '+')
                    {
                        grLines.sort = new List<GridSort> { new GridSort { Dir = "DESC", Field = "PRC_TASK" } };
                        var pricinglines2summ = repositoryProgressPaymentPricing.ListReportPricingLines2Summ(grLines);

                        foreach (var linei in pricinglines2summ)
                        {
                            var summRow = pricinSummTable.NewRow();
                            summRow["LINE"] = linei.PRC_ID;
                            summRow["TASK"] = linei.PRC_TASK;
                            summRow["TSKREFERENCE"] = linei.PRC_TSKREFERENCE;
                            summRow["TSKREQUESTED"] = linei.PRC_TSKREQUESTED;
                            summRow["TSKCOMPLETED"] = linei.PRC_TSKCOMPLETED;
                            summRow["BRNREFERENCE"] = linei.PRC_BRNREFERENCE;
                            summRow["BRNDESC"] = linei.PRC_BRNDESC;
                            summRow["TSKCATDESC"] = linei.PRC_TSKCATDESC;
                            summRow["TSKTYPEDESC"] = linei.PRC_TSKTYPEDESC;
                            summRow["TSKSHORTDESC"] = linei.PRC_TSKSHORTDESC;
                            summRow["CUSPM"] = linei.PRC_CUSPM;
                            summRow["TOTAL"] = linei.PRC_TOTAL;
                            summRow["PARTTOTAL"] = linei.PRC_PARTTOTAL;
                            summRow["SERVICEFEE"] = linei.PRC_SERVICEFEE;
                            summRow["VAT"] = linei.PRC_VAT;
                            summRow["GRANDTOTAL"] = linei.PRC_GRANDTOTAL;
                            if (p.HideZero == '+' && (linei.PRC_GRANDTOTAL) == 0)
                                continue;
                            pricinSummTable.Rows.Add(summRow);
                        }
                    }


                    break;

                default:
                    var pricinglines1 = repositoryProgressPaymentPricing.ListReportPricingLines(grLines);
                    foreach (var plinei in pricinglines1)
                    {
                        var pricingRow = pricingTable.NewRow();
                        pricingRow["TSK"] = plinei.PRC_TASK;
                        pricingRow["ACT"] = DBNull.Value;
                        pricingRow["ACTDESC"] = DBNull.Value;
                        pricingRow["UNITPRICE"] = plinei.PRC_UNITPRICE;
                        pricingRow["UOM"] = plinei.PRC_UOM;
                        pricingRow["QTY"] = plinei.PRC_QTY;
                        pricingRow["TYPE"] = plinei.PRC_TYPE;
                        pricingRow["SUBTYPE"] = plinei.PRC_SUBTYPE;
                        pricingRow["TYPEDESC"] = plinei.PRC_TYPEDESC;
                        pricingRow["HASQUOTATION"] = DBNull.Value;
                        pricingRow["MAILRECIPIENTS"] = DBNull.Value;
                        if (p.HideZero == '+' && (plinei.PRC_QTY * plinei.PRC_UNITPRICE) == 0)
                            continue;
                        pricingTable.Rows.Add(pricingRow);
                    }

                    break;
            }

        }

        public ActionResult ZFile(HttpResponseBase Response, ReportDocument rptH, IList<TM_RPT_PROGRESSPAYMENT> lines, bool OnlyServiceForms)
        {
            var efo = new ExcelFormatOptions { ExcelUseConstantColumnWidth = false };
            rptH.ExportOptions.FormatOptions = efo;
            var streamReport = rptH.ExportToStream(ExportFormatType.Excel);

            var zipfilename = string.Format("PSP_{0:dd-MM-yyyy HH:mm:ss}.zip", DateTime.Now);
            Response.Clear();
            Response.BufferOutput = false;
            Response.ContentType = "application/zip";
            Response.AppendHeader("content-disposition", string.Format("attachment; filename={0}", zipfilename));

            using (var zipOutputStream = new ZipOutputStream(Response.OutputStream))
            {
                zipOutputStream.SetLevel(9); // No compression
                zipOutputStream.UseZip64 = UseZip64.Off;
                zipOutputStream.IsStreamOwner = false;

                var filename = string.Format("PSP_{0:dd-MM-yyyy HH:mm:ss}.xls", DateTime.Now);
                var crc = new ICSharpCode.SharpZipLib.Checksum.Crc32();

                var file = new FileStreamResult(streamReport, "application/vnd.ms-excel");
                var data = StreamHelper.ReadFully(file.FileStream);

                var zipEntry = new ZipEntry(string.Format(@"{0}", filename)) { DateTime = DateTime.Now, Size = data.Length };
                crc.Reset();
                crc.Update(data);
                zipEntry.Crc = crc.Value;
                zipOutputStream.PutNextEntry(zipEntry);
                zipOutputStream.Write(data, 0, data.Length);
                zipOutputStream.CloseEntry();

                var tasks = lines.DistinctBy(x => x.RPP_TSK).Select(x => x.RPP_TSK);
                foreach (var task in tasks)
                {
                    if (!Response.IsClientConnected)
                        break;

                    var documents = new RepositoryDocuments().List("TASK", task.ToString());
                    if (documents!= null && documents.Count > 0)
                    {

                        var otherdocs = OnlyServiceForms ? new TMDOCSMETA[] { } : documents.Where(x => x.DOC_TYPE != "SERVISFORMU");
                        var serviceforms = documents.Where(x => x.DOC_TYPE == "SERVISFORMU");
                        var otherdocsarr = otherdocs as TMDOCSMETA[] ?? otherdocs.ToArray();
                        var serviceformsarr = serviceforms as TMDOCSMETA[] ?? serviceforms.ToArray();

                        if (otherdocsarr.Length > 0 || serviceformsarr.Length > 0)
                        {
                            var zipEntryFolder = new ZipEntry(string.Format(@"{0}/", task));
                            zipOutputStream.PutNextEntry(zipEntryFolder);
                            zipOutputStream.CloseEntry();


                            if (otherdocsarr.Any())
                            {
                                foreach (var doc in otherdocsarr)
                                {
                                    var filecontent = FileHelper.ReadFileIfPossible(doc.DOC_PATH, true);
                                    if (filecontent == null)
                                        continue;
                                    
                                    var zipEntryDoc = new ZipEntry(string.Format(@"{0}/Dokumanlar/{1}", task, ZipEntry.CleanName(doc.DOC_OFN))) { DateTime = DateTime.Now, Size = filecontent.Length };
                                    crc.Reset();
                                    crc.Update(filecontent);
                                    zipEntryDoc.Crc = crc.Value;
                                    zipOutputStream.PutNextEntry(zipEntryDoc);
                                    zipOutputStream.Write(filecontent, 0, filecontent.Length);
                                    zipOutputStream.CloseEntry();
                                }
                            }
                            if (serviceformsarr.Any())
                            {
                                foreach (var doc in serviceformsarr)
                                {
                                    var filecontent = FileHelper.ReadFileIfPossible(doc.DOC_PATH, true);
                                    if (filecontent == null)
                                        continue;

                                    var zipEntryDoc = new ZipEntry(string.Format(@"{0}/Servis Formu/{1}", task, ZipEntry.CleanName(doc.DOC_OFN))) { DateTime = DateTime.Now, Size = filecontent.Length };
                                    crc.Reset();
                                    crc.Update(filecontent);
                                    zipEntryDoc.Crc = crc.Value;
                                    zipOutputStream.PutNextEntry(zipEntryDoc);
                                    zipOutputStream.Write(filecontent, 0, filecontent.Length);
                                    zipOutputStream.CloseEntry();
                                }
                            }
                        }
                    }
                }
                zipOutputStream.Flush();
                zipOutputStream.Finish();
                zipOutputStream.Close();

            }

            return new HttpStatusCodeResult(HttpStatusCode.OK);

        }

        public GridRequest BuildPSPGridFilter(PSPParameters p)
        {
            var gr = new GridRequest { loadall = true, filter = new GridFilters { Filters = new List<GridFilter>() } };

            if (!string.IsNullOrEmpty(p.Customer))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKCUSTOMER", Operator = "eq", Value = p.Customer });
            if (!string.IsNullOrEmpty(p.Branch))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKBRANCH", Operator = "eq", Value = p.Branch });
            if (!string.IsNullOrEmpty(p.Authorized))
                gr.filter.Filters.Add(new GridFilter { Operator = "sqlfunc", Value = $"dbo.CheckAuthorizedBranchUsers(RPP_TSKBRANCH,'{p.Authorized}') = 1" });
            if (!string.IsNullOrEmpty(p.Tasktype))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKTYPE", Operator = "eq", Value = p.Tasktype });
            if (!string.IsNullOrEmpty(p.Taskcategory))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKCATEGORY", Operator = "in", Value = new JArray(p.Taskcategory.Split(',')) });
            if (!string.IsNullOrEmpty(p.TskTasktype))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKTASKTYPE", Operator = "in", Value = new JArray(p.TskTasktype.Split(',')) });
            if (!string.IsNullOrEmpty(p.PSPStatus))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPSTATUS", Operator = "eq", Value = p.PSPStatus });
            if (!string.IsNullOrEmpty(p.InvoiceNo))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPINVOICENO", Operator = "eq", Value = p.InvoiceNo });
            if (!string.IsNullOrEmpty(p.Task))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSK", Operator = "in", Value = new JArray(p.Task.Split(',')) });
            if (!string.IsNullOrEmpty(p.PSP))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSP", Operator = "in", Value = new JArray(p.PSP.Split(',')) });
            if (!string.IsNullOrEmpty(p.GroupCode))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPGROUP", Operator = "in", Value = new JArray(p.GroupCode.Split(',')) });
            if (p.PSPStart.HasValue)
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPCREATED", Operator = "gte", Value = p.PSPStart.Value.Date });
            if (p.PSPEnd.HasValue)
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPCREATED", Operator = "lte", Value = p.PSPEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59) });
            if (p.TskStart.HasValue)
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKCOMPLETED", Operator = "gte", Value = p.TskStart.Value.Date });
            if (p.TskEnd.HasValue)
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_TSKCOMPLETED", Operator = "lte", Value = p.TskEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59) });
            if (p.PSPInvoiceDateStart.HasValue)
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPINVOICEDATE", Operator = "gte", Value = p.PSPInvoiceDateStart.Value.Date });
            if (p.PSPInvoiceDateEnd.HasValue)
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_PSPINVOICEDATE", Operator = "lte", Value = p.PSPInvoiceDateEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59) });
            if (!string.IsNullOrEmpty(p.BranchType))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_BRNTYPE", Operator = "in", Value = new JArray(p.BranchType.Split(',')) });
            if (p.HasQuotation == '+')
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_HASQUOTATION", Operator = "eq", Value = '+' });
            if (!string.IsNullOrEmpty(p.SHFTIP))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_SHFTIP", Operator = "in", Value = new JArray(p.SHFTIP.Split(','))});
            if (!string.IsNullOrEmpty(p.SHHYIL))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_SHHYIL", Operator = "in", Value = new JArray(p.SHHYIL.Split(','))});
            if (!string.IsNullOrEmpty(p.SHHAY))
                gr.filter.Filters.Add(new GridFilter { Field = "RPP_SHHAY", Operator = "in", Value = new JArray(p.SHHAY.Split(','))});
            return gr;
        }
    }
}