using NPOI.OpenXmlFormats.Spreadsheet;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Imaging;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web;
using Ovi.Task.Data.Entity.Task;
using Svg;
using Ovi.Task.Helper.Shared;

namespace Ovi.Task.UI.Helper.Reports
{
    public class TSK
    {
        public DataTable Header(TMTASKPRINTVIEW taskPrintView)
        {
            var dtHeader = new DataTable("TASK");
            dtHeader.Columns.AddRange(new[]
            {
                new DataColumn("TSK_ID", typeof(int)),
                new DataColumn("TSK_REQUESTED",typeof(DateTime)),
                new DataColumn("TSK_SHORTDESC"),
                new DataColumn("TSK_TASKTYPE"),
                new DataColumn("TSK_CATEGORYDESC"),
                new DataColumn("TSK_CUSDESC"),
                new DataColumn("TSK_BRNADDRESS"),
                new DataColumn("TSK_BRNDESC")
            });

        
            dtHeader.Columns["TSK_REQUESTED"].AllowDBNull = true;
           

            var repHeaderRow = dtHeader.NewRow();
            repHeaderRow["TSK_ID"] = taskPrintView.TSK_ID;
            repHeaderRow["TSK_REQUESTED"] = taskPrintView.TSK_REQUESTED.HasValue ? (object)taskPrintView.TSK_REQUESTED : DBNull.Value;
            repHeaderRow["TSK_SHORTDESC"] = taskPrintView.TSK_SHORTDESC;
            repHeaderRow["TSK_TASKTYPE"] = taskPrintView.TSK_TASKTYPE;
            repHeaderRow["TSK_CATEGORYDESC"] = taskPrintView.TSK_CATEGORYDESC;
            repHeaderRow["TSK_CUSDESC"] = taskPrintView.TSK_CUSDESC;
            repHeaderRow["TSK_BRNADDRESS"] = taskPrintView.TSK_BRNADDRESS;
            repHeaderRow["TSK_BRNDESC"] = taskPrintView.TSK_BRNDESC;


            dtHeader.Rows.Add(repHeaderRow);
            return dtHeader;
        }

        public DataTable PricingLines(TSKParameters tskParameters)
        {
            var dtLines = new DataTable("PRICINGLINES");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("TPR_CODE"),
                new DataColumn("TPR_DESC"),
                new DataColumn("TPR_TYPE"),
                new DataColumn("TPR_UOM"),
                new DataColumn("TPR_PARBRAND"),
                new DataColumn("TPR_QTY",typeof(decimal)),
             
            });

           

            var pricing = new RepositoryTasks().PricingPrintView(tskParameters.TaskId);
            if (pricing != null)
            {
                foreach (var line in pricing)
                {
                    var row = dtLines.NewRow();
                    row["TPR_CODE"] = line.TPR_CODE;
                    row["TPR_DESC"] = line.TPR_DESC;
                    row["TPR_UOM"] = line.TPR_UOM;
                    row["TPR_UOM"] = line.TPR_UOM;
                    row["TPR_QTY"] = line.TPR_QTY;
                    row["TPR_PARBRAND"] = line.TPR_PARBRAND;
                    dtLines.Rows.Add(row);
                }
            }

            return dtLines;
        } 

        public DataTable Comments(TSKParameters tskParameters)
        {
            var dtComments = new DataTable("COMMENTS");
            dtComments.Columns.AddRange(new[]
            {
                new DataColumn("CMN_TEXT"),
                new DataColumn("CMN_CREATEDBY"),
                new DataColumn("CMN_CREATED",typeof(DateTime))
            });

            var commentLines = new RepositoryComments().ListBySubjectAndSource("TASK", tskParameters.TaskId.ToString());

            foreach (var line in commentLines)
            {
                var row = dtComments.NewRow();
                row["CMN_TEXT"] = line.CMN_TEXT;
                row["CMN_CREATEDBY"] = line.CMN_CREATEDBY;
                row["CMN_CREATED"] = line.CMN_CREATED;
                dtComments.Rows.Add(row);
            }





            return dtComments;
        }

        public DataTable BookedLines(TSKParameters tskParameters)
        {
            var dtLines = new DataTable("BOOKEDLINES");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("BOO_DATE",typeof(DateTime)),
                new DataColumn("BOO_USERDESC"),
                new DataColumn("BOO_START"),
                new DataColumn("BOO_END"),
                new DataColumn("BOO_SUM",typeof(decimal)),

            });

            var gr = new GridRequest
            {
                loadall = true,
                groupedFilters = new List<GridFilters>(),
                filter = new GridFilters { Filters = new List<GridFilter>(), Logic = "and" }
            };


            gr.filter.Filters.Add(new GridFilter
            {
                Field = "BOO_TASK",
                Value = tskParameters.TaskId,
                Operator = "eq"
            });

            var booLines = new RepositoryBookedHours().List(gr);
          
            if (booLines != null)
            {
                foreach (var line in booLines)
                {
                   
                   var row = dtLines.NewRow();
                    row["BOO_DATE"] = line.BOO_DATE;
                    row["BOO_USERDESC"] = line.BOO_USERDESC;
                    row["BOO_START"] = new TimeSpan(0, 0, Convert.ToInt32(line.BOO_START)).ToString().Substring(0, 5);
                    row["BOO_END"] = new TimeSpan(0,0,Convert.ToInt32(line.BOO_END)).ToString().Substring(0, 5);
                    row["BOO_SUM"] = line.BOO_CALCHOURS * 60;
                 
                    dtLines.Rows.Add(row);
                }
            }

            return dtLines;
        }



        public DataTable Signature(TSKParameters tskParameters)
        {
            var dtSignature = new DataTable("SIGN");
            dtSignature.Columns.AddRange(new[]
            {
                new DataColumn("DATA",typeof(byte[])),
                new DataColumn("NOTES"),

            });


            var svgStr = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"320\" height=\"60\">\r\n</svg>";
            var repositoryTaskActivities = new RepositoryTaskActivities();
            var repositoryMobileDrawing = new RepositoryMobileDrawings();
            var taskActivityList = repositoryTaskActivities.GetByTaskId(tskParameters.TaskId);
            if (taskActivityList != null)
            {
                foreach (var tsa in taskActivityList)
                {
                    var drawing = repositoryMobileDrawing.Get(new TMMOBILEDRAWINGS
                    {
                        DRW_TASK = (int)tsa.TSA_TASK,
                        DRW_ACTIVITY = (int)tsa.TSA_LINE
                    });

                    if (drawing == null) continue;

                    svgStr = drawing.DRW_DATA;
                    var svgDoc = SvgDocument.FromSvg<SvgDocument>(svgStr);
                    var bytes = svgDoc.Draw().ToByteArray(ImageFormat.Bmp);
                    var row = dtSignature.NewRow();
                    row["DATA"] = bytes;
                    row["NOTES"] = drawing.DRW_NOTES;

                    dtSignature.Rows.Add(row);
                    break;
                }
            }

            if (dtSignature.Rows.Count == 0)
            {
                var row = dtSignature.NewRow();
                var bytes = Encoding.UTF8.GetBytes(svgStr);
                row["DATA"] = bytes;
                dtSignature.Rows.Add(row);
            }

            return dtSignature;
        }
    }
}