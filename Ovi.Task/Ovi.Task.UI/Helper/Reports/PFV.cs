using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Ovi.Task.Data.Entity.Project;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Controllers;

namespace Ovi.Task.UI.Helper.Reports
{
    public class PFV
    {
        public DataTable PFVLines(IList<TMPROJECTFINANCIALVIEW> fvlines)
        {


            var dtLines = new DataTable("LINES");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("PROJECT",typeof(long)),
                new DataColumn("PROJECTDESC"),
                new DataColumn("PROJECTTYPE"),
                new DataColumn("PROJECTDATECREATED"),
                new DataColumn("PROJECTTASKID",typeof(long)),
                new DataColumn("PROJECTTASKTYPE"),
                new DataColumn("PROJECTTASKDESCRIPTION"),
                new DataColumn("PLANNEDLABORSUM",typeof(decimal)),
                new DataColumn("PLANNEDMISCCOST",typeof(decimal)),
                new DataColumn("PLANNEDPART",typeof(decimal)),
                new DataColumn("PLANNEDTOOL",typeof(decimal)),
                new DataColumn("PLANNEDTOTAL",typeof(decimal)),
                new DataColumn("OFFERLABORSUM",typeof(decimal)),
                new DataColumn("OFFERMISCCOST",typeof(decimal)),
                new DataColumn("OFFERPART",typeof(decimal)),
                new DataColumn("OFFERTOOL",typeof(decimal)),
                new DataColumn("OFFERTOTAL",typeof(decimal)),
                new DataColumn("ACTUALLABORSUM",typeof(decimal)),
                new DataColumn("ACTUALMISCCOST",typeof(decimal)),
                new DataColumn("ACTUALPART",typeof(decimal)),
                new DataColumn("ACTUALTOOL",typeof(decimal)),
                new DataColumn("ACTUALTOTAL",typeof(decimal)),
                new DataColumn("CURRENCY"),
                new DataColumn("PLANNEDFIXEDCOST",typeof(decimal)),
                new DataColumn("OFFERFIXEDCOST",typeof(decimal))

            });


            dtLines.Columns["PLANNEDLABORSUM"].AllowDBNull = true;
            dtLines.Columns["PLANNEDMISCCOST"].AllowDBNull = true;
            dtLines.Columns["PLANNEDPART"].AllowDBNull = true;
            dtLines.Columns["PLANNEDTOOL"].AllowDBNull = true;
            dtLines.Columns["PLANNEDTOTAL"].AllowDBNull = true;
            dtLines.Columns["OFFERLABORSUM"].AllowDBNull = true;
            dtLines.Columns["OFFERMISCCOST"].AllowDBNull = true;
            dtLines.Columns["OFFERPART"].AllowDBNull = true;
            dtLines.Columns["OFFERTOOL"].AllowDBNull = true;
            dtLines.Columns["OFFERTOTAL"].AllowDBNull = true;
            dtLines.Columns["ACTUALLABORSUM"].AllowDBNull = true;
            dtLines.Columns["ACTUALMISCCOST"].AllowDBNull = true;
            dtLines.Columns["ACTUALPART"].AllowDBNull = true;
            dtLines.Columns["ACTUALTOOL"].AllowDBNull = true;
            dtLines.Columns["ACTUALTOTAL"].AllowDBNull = true;
            dtLines.Columns["PLANNEDFIXEDCOST"].AllowDBNull = true;
            dtLines.Columns["OFFERFIXEDCOST"].AllowDBNull = true;

            foreach (var linei in fvlines)
            {
                var repRow = dtLines.NewRow();
                repRow["PROJECT"] = linei.PRJ_ID;
                repRow["CURRENCY"] = linei.PRJ_CURR;
                repRow["PROJECTDESC"] = linei.PRJ_DESC;
                repRow["PROJECTTYPE"] = linei.PRJ_TYPE;
                repRow["PROJECTDATECREATED"] = linei.PRJ_CREATED;
                repRow["PROJECTTASKID"] = linei.PRJ_TSKID;
                repRow["PROJECTTASKTYPE"] = linei.PRJ_TSKTYPE;
                repRow["PROJECTTASKDESCRIPTION"] = linei.PRJ_TSKSHORTDESC;
                repRow["PLANNEDLABORSUM"] = linei.PRJ_LABORSUM_PLANNED.HasValue ? (object)linei.PRJ_LABORSUM_PLANNED : DBNull.Value;
                repRow["PLANNEDMISCCOST"] = linei.PRJ_MISCCOST_PLANNED.HasValue ? (object)linei.PRJ_MISCCOST_PLANNED : DBNull.Value;
                repRow["PLANNEDPART"] = linei.PRJ_PART_PLANNED.HasValue ? (object)linei.PRJ_PART_PLANNED : DBNull.Value;
                repRow["PLANNEDTOOL"] = linei.PRJ_TOOL_PLANNED.HasValue ? (object)linei.PRJ_TOOL_PLANNED : DBNull.Value;
                repRow["PLANNEDTOTAL"] = linei.PRJ_TOTAL_PLANNED.HasValue ? (object)linei.PRJ_TOTAL_PLANNED : DBNull.Value;
                repRow["OFFERLABORSUM"] = linei.PRJ_LABORSUM_OFFER.HasValue ? (object)linei.PRJ_LABORSUM_OFFER : DBNull.Value;
                repRow["OFFERMISCCOST"] = linei.PRJ_MISCCOST_OFFER.HasValue ? (object)linei.PRJ_MISCCOST_OFFER : DBNull.Value;
                repRow["OFFERPART"] = linei.PRJ_PART_OFFER.HasValue ? (object)linei.PRJ_PART_OFFER : DBNull.Value;
                repRow["OFFERTOOL"] = linei.PRJ_TOOL_OFFER.HasValue ? (object)linei.PRJ_TOOL_OFFER : DBNull.Value;
                repRow["OFFERTOTAL"] = linei.PRJ_TOTAL_OFFER.HasValue ? (object)linei.PRJ_TOTAL_OFFER : DBNull.Value;
                repRow["ACTUALLABORSUM"] = linei.PRJ_LABORSUM_ACTUAL.HasValue ? (object)linei.PRJ_LABORSUM_ACTUAL : DBNull.Value;
                repRow["ACTUALMISCCOST"] = linei.PRJ_MISCCOST_ACTUAL.HasValue ? (object)linei.PRJ_MISCCOST_ACTUAL : DBNull.Value;
                repRow["ACTUALPART"] = linei.PRJ_PART_ACTUAL.HasValue ? (object)linei.PRJ_PART_ACTUAL : DBNull.Value;
                repRow["ACTUALTOOL"] = linei.PRJ_TOOL_ACTUAL.HasValue ? (object)linei.PRJ_TOOL_ACTUAL : DBNull.Value;
                repRow["ACTUALTOTAL"] = linei.PRJ_TOTAL_ACTUAL.HasValue ? (object)linei.PRJ_TOTAL_ACTUAL : DBNull.Value;
                repRow["PLANNEDFIXEDCOST"] = linei.PRJ_FIXEDCOST_PLANNED.HasValue ? (object)linei.PRJ_FIXEDCOST_PLANNED : DBNull.Value;
                repRow["OFFERFIXEDCOST"] = linei.PRJ_FIXEDCOST_OFFER.HasValue ? (object)linei.PRJ_FIXEDCOST_OFFER : DBNull.Value;

                dtLines.Rows.Add(repRow);
            }

            return dtLines;
        }

        public DataTable PFVChart01(IList<TMPROJECTFINANCIALVIEW> fvlines)
        {


            var dtChart01 = new DataTable("CHART01");
            dtChart01.Columns.AddRange(new[]
            {
                new DataColumn("Line"),
                new DataColumn("Type"),
                new DataColumn("SubType"),
                new DataColumn("Total",typeof(decimal))
            });


            dtChart01.Columns["Total"].AllowDBNull = true;

            // Labor
            var r1 = dtChart01.NewRow();
            r1["Line"] = "1";
            r1["Type"] = "Labor";
            r1["SubType"] = "01. Planned";
            r1["Total"] = fvlines.Sum(x => x.PRJ_LABORSUM_PLANNED);
            dtChart01.Rows.Add(r1);

            var r2 = dtChart01.NewRow();
            r2["Line"] = "2";
            r2["Type"] = "Labor";
            r2["SubType"] = "02. Offered";
            r2["Total"] = fvlines.Sum(x => x.PRJ_LABORSUM_OFFER);
            dtChart01.Rows.Add(r2);

            var r3 = dtChart01.NewRow();
            r3["Line"] = "3";
            r3["Type"] = "Labor";
            r3["SubType"] = "03. Actual";
            r3["Total"] = fvlines.Sum(x => x.PRJ_LABORSUM_ACTUAL);
            dtChart01.Rows.Add(r3);


            //Part
            var r4 = dtChart01.NewRow();
            r4["Line"] = "4";
            r4["Type"] = "Part";
            r4["SubType"] = "01. Planned";
            r4["Total"] = fvlines.Sum(x => x.PRJ_PART_PLANNED);
            dtChart01.Rows.Add(r4);

            var r5 = dtChart01.NewRow();
            r5["Line"] = "5";
            r5["Type"] = "Part";
            r5["SubType"] = "02. Offered";
            r5["Total"] = fvlines.Sum(x => x.PRJ_PART_OFFER);
            dtChart01.Rows.Add(r5);

            var r6 = dtChart01.NewRow();
            r6["Line"] = "6";
            r6["Type"] = "Part";
            r6["SubType"] = "03. Actual";
            r6["Total"] = fvlines.Sum(x => x.PRJ_PART_ACTUAL);
            dtChart01.Rows.Add(r6);


            // Tool
            var r7 = dtChart01.NewRow();
            r7["Line"] = "7";
            r7["Type"] = "Tool";
            r7["SubType"] = "01. Planned";
            r7["Total"] = fvlines.Sum(x => x.PRJ_TOOL_PLANNED);
            dtChart01.Rows.Add(r7);

            var r8 = dtChart01.NewRow();
            r8["Line"] = "8";
            r8["Type"] = "Tool";
            r8["SubType"] = "02. Offered";
            r8["Total"] = fvlines.Sum(x => x.PRJ_TOOL_OFFER);
            dtChart01.Rows.Add(r8);

            var r9 = dtChart01.NewRow();
            r9["Line"] = "9";
            r9["Type"] = "Tool";
            r9["SubType"] = "03. Actual";
            r9["Total"] = fvlines.Sum(x => x.PRJ_TOOL_ACTUAL);
            dtChart01.Rows.Add(r9);


            //Misc. Cost
            var r10 = dtChart01.NewRow();
            r10["Line"] = "10";
            r10["Type"] = "Misc. Cost";
            r10["SubType"] = "01. Planned";
            r10["Total"] = fvlines.Sum(x => x.PRJ_MISCCOST_PLANNED);
            dtChart01.Rows.Add(r10);

            var r11 = dtChart01.NewRow();
            r11["Line"] = "11";
            r11["Type"] = "Misc. Cost";
            r11["SubType"] = "02. Offered";
            r11["Total"] = fvlines.Sum(x => x.PRJ_MISCCOST_OFFER);
            dtChart01.Rows.Add(r11);

            var r12 = dtChart01.NewRow();
            r12["Line"] = "12";
            r12["Type"] = "Misc. Cost";
            r12["SubType"] = "03. Actual";
            r12["Total"] = fvlines.Sum(x => x.PRJ_MISCCOST_ACTUAL);
            dtChart01.Rows.Add(r12);


            var r13 = dtChart01.NewRow();
            r13["Line"] = "13";
            r13["Type"] = "Fixed Cost";
            r13["SubType"] = "01. Planned";
            r13["Total"] = fvlines.Sum(x => x.PRJ_FIXEDCOST_PLANNED);
            dtChart01.Rows.Add(r13);

            var r14 = dtChart01.NewRow();
            r14["Line"] = "14";
            r14["Type"] = "Fixed Cost";
            r14["SubType"] = "02. Offered";
            r14["Total"] = fvlines.Sum(x => x.PRJ_FIXEDCOST_OFFER);
            dtChart01.Rows.Add(r14);

            var r15 = dtChart01.NewRow();
            r15["Line"] = "15";
            r15["Type"] = "Fixed Cost";
            r15["SubType"] = "03. Actual";
            r15["Total"] = 0;
            dtChart01.Rows.Add(r15);

            return dtChart01;
        }

        public DataTable PFVParameters(PFVParametes p)
        {
            var dtReportParams = new DataTable("PARAMETERS");
            dtReportParams.Columns.AddRange(new[]
            {
                new DataColumn("PROJECT",typeof(string)),
                new DataColumn("TASK",typeof(string)),
                new DataColumn("CUSTOMER",typeof(string)),
                new DataColumn("PROJECTSTATUS",typeof(string)),
                new DataColumn("PROJECTTYPE",typeof(string)),
                new DataColumn("TASKTYPE",typeof(string)),
                new DataColumn("DATES",typeof(string)),
            });

            dtReportParams.Columns["PROJECT"].AllowDBNull = true;
            dtReportParams.Columns["TASK"].AllowDBNull = true;
            dtReportParams.Columns["CUSTOMER"].AllowDBNull = true;
            dtReportParams.Columns["PROJECTSTATUS"].AllowDBNull = true;
            dtReportParams.Columns["PROJECTTYPE"].AllowDBNull = true;
            dtReportParams.Columns["TASKTYPE"].AllowDBNull = true;
            dtReportParams.Columns["DATES"].AllowDBNull = true;

            var repParamRow = dtReportParams.NewRow();
            repParamRow["PROJECT"] = p.Project.HasValue ? (object)p.Project : DBNull.Value;
            repParamRow["CUSTOMER"] = !string.IsNullOrEmpty(p.Customer) ? (object)p.Customer : DBNull.Value;
            repParamRow["PROJECTSTATUS"] = !string.IsNullOrEmpty(p.ProjectStatus) ? (object)p.ProjectStatus : DBNull.Value;
            repParamRow["TASK"] = p.Task.HasValue ? (object)p.Task : DBNull.Value;
            repParamRow["PROJECTTYPE"] = !string.IsNullOrEmpty(p.ProjectType) ? (object)p.ProjectType : "";
            repParamRow["TASKTYPE"] = !string.IsNullOrEmpty(p.Tasktype) ? (object)p.Tasktype : "";
            repParamRow["DATES"] = (p.CreatedStart.HasValue ? (object)p.CreatedStart.Value.ToString(OviShared.ShortDate) : "") + " " +
                                   (p.CreatedEnd.HasValue ? p.CreatedEnd.Value.ToString(OviShared.ShortDate) : "");

            dtReportParams.Rows.Add(repParamRow);

            return dtReportParams;


        }
    }
}