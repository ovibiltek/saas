using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Data;
using System.Linq;

namespace Ovi.Task.UI.Helper.Reports
{
    public class CUP
    {
        public DataTable CUPLines(CUPParameters p)
        {
            var repositoryCustomerPerformanceReport = new RepositoryCustomerPerformanceReport();
            var lines = repositoryCustomerPerformanceReport.List(new PerformanceReportParameters
            {
                Customer = p.Customer,
                CustomerGroup = p.CustomerGroup,
                Type = p.Tasktype,
                TaskCompletedStart =
                    (p.TaskCompletedStart.HasValue ? p.TaskCompletedStart.Value.Date : (DateTime?)null),
                TaskCompletedEnd = (p.TaskCompletedEnd.HasValue
                    ? p.TaskCompletedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                    : (DateTime?)null)
            });

            var dtReport = new DataTable("REPORT");
            dtReport.Columns.AddRange(new[]
            {
                new DataColumn("CAT_ROWID", typeof(long)),
                new DataColumn("CAT_DESC"),
                new DataColumn("CAT_TYPCODE"),
                new DataColumn("CAT_CUSCODE"),
                new DataColumn("CAT_TASKCOUNT", typeof(decimal)),
                new DataColumn("CAT_ACTCOUNT", typeof(decimal)),
                new DataColumn("CAT_PSPPART", typeof(decimal)),
                new DataColumn("CAT_PSPLABOR", typeof(decimal)),
                new DataColumn("CAT_PSPSUM", typeof(decimal)),
                new DataColumn("CAT_COSTPART", typeof(decimal)),
                new DataColumn("CAT_COSTLABOR", typeof(decimal)),
                new DataColumn("CAT_COSTSUM", typeof(decimal)),
                new DataColumn("CAT_PROFITPART", typeof(decimal)),
                new DataColumn("CAT_PROFITLABOR", typeof(decimal)),
                new DataColumn("CAT_PROFITSUM", typeof(decimal)),
                new DataColumn("CAT_AVGPLANTIME", typeof(decimal)),
                new DataColumn("CAT_AVGACTIONTIME", typeof(decimal)),
                new DataColumn("CAT_AVGCOMPLETEDTIME", typeof(decimal)),
                new DataColumn("CAT_AVGCLOSINGTIME", typeof(decimal)),
                new DataColumn("CAT_AVGPSPTIME", typeof(decimal))
            });

            dtReport.Columns["CAT_TASKCOUNT"].AllowDBNull = true;
            dtReport.Columns["CAT_ACTCOUNT"].AllowDBNull = true;
            dtReport.Columns["CAT_PSPPART"].AllowDBNull = true;
            dtReport.Columns["CAT_PSPLABOR"].AllowDBNull = true;
            dtReport.Columns["CAT_PSPSUM"].AllowDBNull = true;
            dtReport.Columns["CAT_COSTPART"].AllowDBNull = true;
            dtReport.Columns["CAT_COSTLABOR"].AllowDBNull = true;
            dtReport.Columns["CAT_COSTSUM"].AllowDBNull = true;
            dtReport.Columns["CAT_PROFITPART"].AllowDBNull = true;
            dtReport.Columns["CAT_PROFITLABOR"].AllowDBNull = true;
            dtReport.Columns["CAT_PROFITSUM"].AllowDBNull = true;
            dtReport.Columns["CAT_AVGPLANTIME"].AllowDBNull = true;
            dtReport.Columns["CAT_AVGACTIONTIME"].AllowDBNull = true;
            dtReport.Columns["CAT_AVGCOMPLETEDTIME"].AllowDBNull = true;
            dtReport.Columns["CAT_AVGCLOSINGTIME"].AllowDBNull = true;
            dtReport.Columns["CAT_AVGPSPTIME"].AllowDBNull = true;

            foreach (var linei in lines)
            {
                var repRow = dtReport.NewRow();
                repRow["CAT_ROWID"] = linei.CAT_ROWID;
                repRow["CAT_DESC"] = linei.CAT_DESC;
                repRow["CAT_TYPCODE"] = linei.CAT_TYPCODE;
                repRow["CAT_CUSCODE"] = linei.CAT_CUSCODE;
                repRow["CAT_TASKCOUNT"] = linei.CAT_TASKCOUNT.HasValue ? (object)linei.CAT_TASKCOUNT : DBNull.Value;
                repRow["CAT_ACTCOUNT"] = linei.CAT_ACTCOUNT.HasValue ? (object)linei.CAT_ACTCOUNT : DBNull.Value;
                repRow["CAT_PSPPART"] = linei.CAT_PSPPART.HasValue ? (object)linei.CAT_PSPPART : DBNull.Value;
                repRow["CAT_PSPLABOR"] = linei.CAT_PSPLABOR.HasValue ? (object)linei.CAT_PSPLABOR : DBNull.Value;
                repRow["CAT_PSPSUM"] = linei.CAT_PSPSUM.HasValue ? (object)linei.CAT_PSPSUM : DBNull.Value;
                repRow["CAT_COSTPART"] = linei.CAT_COSTPART.HasValue ? (object)linei.CAT_COSTPART : DBNull.Value;
                repRow["CAT_COSTLABOR"] = linei.CAT_COSTLABOR.HasValue ? (object)linei.CAT_COSTLABOR : DBNull.Value;
                repRow["CAT_COSTSUM"] = linei.CAT_COSTSUM.HasValue ? (object)linei.CAT_COSTSUM : DBNull.Value;
                repRow["CAT_PROFITPART"] = linei.CAT_PROFITPART.HasValue ? (object)linei.CAT_PROFITPART : DBNull.Value;
                repRow["CAT_PROFITLABOR"] = linei.CAT_PROFITLABOR.HasValue
                    ? (object)linei.CAT_PROFITLABOR
                    : DBNull.Value;
                repRow["CAT_PROFITSUM"] = linei.CAT_PROFITSUM.HasValue ? (object)linei.CAT_PROFITSUM : DBNull.Value;
                repRow["CAT_AVGPLANTIME"] = linei.CAT_AVGPLANTIME.HasValue
                    ? (object)linei.CAT_AVGPLANTIME
                    : DBNull.Value;
                repRow["CAT_AVGACTIONTIME"] = linei.CAT_AVGACTIONTIME.HasValue
                    ? (object)linei.CAT_AVGACTIONTIME
                    : DBNull.Value;
                repRow["CAT_AVGCOMPLETEDTIME"] = linei.CAT_AVGCOMPLETEDTIME.HasValue
                    ? (object)linei.CAT_AVGCOMPLETEDTIME
                    : DBNull.Value;
                repRow["CAT_AVGCLOSINGTIME"] = linei.CAT_AVGCLOSINGTIME.HasValue
                    ? (object)linei.CAT_AVGCLOSINGTIME
                    : DBNull.Value;
                repRow["CAT_AVGPSPTIME"] = linei.CAT_AVGPSPTIME.HasValue ? (object)linei.CAT_AVGPSPTIME : DBNull.Value;
                dtReport.Rows.Add(repRow);
            }

            return dtReport;
        }

        public DataTable CUPSum(CUPParameters p)
        {
            var repositoryCustomerPerformanceReport = new RepositoryCustomerPerformanceReport();
            var sum = repositoryCustomerPerformanceReport.GetSum(new PerformanceReportParameters
            {
                Customer = p.Customer,
                CustomerGroup = p.CustomerGroup,
                Type = p.Tasktype,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCompletedEnd = p.TaskCompletedEnd
            });

            var dtReportSum = new DataTable("REPORTSUM");
            dtReportSum.Columns.AddRange(new[]
            {
                new DataColumn("CAT_ROWID", typeof(long)),
                new DataColumn("CAT_AVGPLANTIME", typeof(decimal)),
                new DataColumn("CAT_AVGACTIONTIME", typeof(decimal)),
                new DataColumn("CAT_AVGCOMPLETEDTIME", typeof(decimal)),
                new DataColumn("CAT_AVGCLOSINGTIME", typeof(decimal)),
                new DataColumn("CAT_AVGPSPTIME", typeof(decimal))
            });

            dtReportSum.Columns["CAT_AVGPLANTIME"].AllowDBNull = true;
            dtReportSum.Columns["CAT_AVGACTIONTIME"].AllowDBNull = true;
            dtReportSum.Columns["CAT_AVGCOMPLETEDTIME"].AllowDBNull = true;
            dtReportSum.Columns["CAT_AVGCLOSINGTIME"].AllowDBNull = true;
            dtReportSum.Columns["CAT_AVGPSPTIME"].AllowDBNull = true;

            var repSumRow = dtReportSum.NewRow();
            repSumRow["CAT_ROWID"] = sum.CAT_ROWID;
            repSumRow["CAT_AVGPLANTIME"] = sum.CAT_AVGPLANTIME.HasValue ? (object)sum.CAT_AVGPLANTIME : DBNull.Value;
            repSumRow["CAT_AVGACTIONTIME"] = sum.CAT_AVGACTIONTIME.HasValue
                ? (object)sum.CAT_AVGACTIONTIME
                : DBNull.Value;
            repSumRow["CAT_AVGCOMPLETEDTIME"] = sum.CAT_AVGCOMPLETEDTIME.HasValue
                ? (object)sum.CAT_AVGCOMPLETEDTIME
                : DBNull.Value;
            repSumRow["CAT_AVGCLOSINGTIME"] = sum.CAT_AVGCLOSINGTIME.HasValue
                ? (object)sum.CAT_AVGCLOSINGTIME
                : DBNull.Value;
            repSumRow["CAT_AVGPSPTIME"] = sum.CAT_AVGPSPTIME.HasValue ? (object)sum.CAT_AVGPSPTIME : DBNull.Value;
            dtReportSum.Rows.Add(repSumRow);

            return dtReportSum;
        }

        public DataTable CUPParameters(CUPParameters p)
        {
            var dtReportParams = new DataTable("REPORTPARAMETERS");
            dtReportParams.Columns.AddRange(new[]
            {
                new DataColumn("CUSTOMER", typeof(string)),
                new DataColumn("TASKTYPE", typeof(string)),
                new DataColumn("REPORTUSER", typeof(string)),
                new DataColumn("TASKCOMPLETEDSTART", typeof(DateTime)),
                new DataColumn("TASKCOMPLETEDEND", typeof(DateTime)),
                new DataColumn("REPORTDATE", typeof(DateTime)),
            });

            dtReportParams.Columns["TASKCOMPLETEDSTART"].AllowDBNull = true;
            dtReportParams.Columns["TASKCOMPLETEDEND"].AllowDBNull = true;

            var repParamRow = dtReportParams.NewRow();
            repParamRow["CUSTOMER"] = !string.IsNullOrEmpty(p.Customer) ? (object)p.Customer : "*";
            if (!string.IsNullOrEmpty(p.CustomerGroup))
            {
                var customers = new RepositoryCustomers().ListByGroup(p.CustomerGroup);
                if (customers != null)
                {
                    repParamRow["CUSTOMER"] = string.Join(",", customers.Select(z => z.CUS_CODE.ToString()));
                }
            }

            repParamRow["TASKTYPE"] = !string.IsNullOrEmpty(p.Tasktype) ? (object)p.Tasktype : "*";
            repParamRow["REPORTUSER"] = UserManager.Instance.User.Description;
            repParamRow["TASKCOMPLETEDSTART"] = p.TaskCompletedStart.HasValue
                ? (object)p.TaskCompletedStart
                : DBNull.Value;
            repParamRow["TASKCOMPLETEDEND"] = p.TaskCompletedEnd.HasValue ? (object)p.TaskCompletedEnd : DBNull.Value;
            repParamRow["REPORTDATE"] = DateTime.Now;

            dtReportParams.Rows.Add(repParamRow);

            return dtReportParams;
        }
    }
}