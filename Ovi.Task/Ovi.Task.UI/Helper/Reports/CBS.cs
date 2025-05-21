using Ovi.Task.Data.Entity;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;

namespace Ovi.Task.UI.Helper.Reports
{
    public class CBS
    {
        public DataTable CBSChartData(IList<TMCUSTOMERSALES> lines)
        {
            var dtReport = new DataTable("GRAFIK_01");
            dtReport.Columns.AddRange(new[]
            {
                new DataColumn("Onarım", typeof(decimal)),
                new DataColumn("Bakım,Ölçüm, Yasal Denetleme", typeof(decimal)),
                new DataColumn("Malzeme Satışı", typeof(decimal)),
                new DataColumn("Teknik İşletme", typeof(decimal)),
                new DataColumn("Kurulum/Montaj", typeof(decimal)),
                new DataColumn("Bakım Tespitleri", typeof(decimal)),
                new DataColumn("Diğer", typeof(decimal)),
            });

            dtReport.Columns["Onarım"].AllowDBNull = true;
            dtReport.Columns["Bakım,Ölçüm, Yasal Denetleme"].AllowDBNull = true;
            dtReport.Columns["Malzeme Satışı"].AllowDBNull = true;
            dtReport.Columns["Teknik İşletme"].AllowDBNull = true;
            dtReport.Columns["Kurulum/Montaj"].AllowDBNull = true;
            dtReport.Columns["Bakım Tespitleri"].AllowDBNull = true;
            dtReport.Columns["Diğer"].AllowDBNull = true;

            decimal? onarim = 0, bakim = 0, malzeme = 0, teknik = 0, kurulum = 0, bakimtespitleri = 0, diger = 0;

            foreach (var linei in lines)
            {
                onarim += (linei.CUS_AR_SUM.HasValue ? linei.CUS_AR_SUM : 0) +
                          (linei.CUS_KO_SUM.HasValue ? linei.CUS_KO_SUM.Value : 0) +
                          (linei.CUS_ON_SUM.HasValue ? linei.CUS_ON_SUM.Value : 0) +
                          (linei.CUS_UY_SUM.HasValue ? linei.CUS_UY_SUM.Value : 0) +
                          (linei.CUS_UI_SUM.HasValue ? linei.CUS_UI_SUM.Value : 0);
                bakim += (linei.CUS_BK_SUM.HasValue ? linei.CUS_BK_SUM.Value : 0) +
                         (linei.CUS_TM_SUM.HasValue ? linei.CUS_TM_SUM.Value : 0) +
                         (linei.CUS_OZ_SUM.HasValue ? linei.CUS_OZ_SUM.Value : 0) +
                         (linei.CUS_YGS_SUM.HasValue ? linei.CUS_YGS_SUM.Value : 0);
                malzeme += linei.CUS_SA_SUM.HasValue ? linei.CUS_SA_SUM.Value : 0;
                teknik += linei.CUS_YE_SUM.HasValue ? linei.CUS_YE_SUM.Value : 0;
                kurulum += linei.CUS_PROJELIISLER_SUM.HasValue ? linei.CUS_PROJELIISLER_SUM.Value : 0;
                bakimtespitleri += linei.CUS_BT_SUM.HasValue ? linei.CUS_BT_SUM.Value : 0;
                diger += linei.CUS_DGR_SUM.HasValue ? linei.CUS_DGR_SUM.Value : 0;
            }

            var repRow = dtReport.NewRow();
            repRow["Onarım"] = onarim.HasValue ? (object)onarim : DBNull.Value;
            repRow["Bakım,Ölçüm, Yasal Denetleme"] = bakim.HasValue ? (object)bakim : DBNull.Value;
            repRow["Malzeme Satışı"] = malzeme.HasValue ? (object)malzeme : DBNull.Value;
            repRow["Teknik İşletme"] = teknik.HasValue ? (object)teknik : DBNull.Value;
            repRow["Kurulum/Montaj"] = kurulum.HasValue ? (object)kurulum : DBNull.Value;
            repRow["Bakım Tespitleri"] = bakimtespitleri.HasValue ? (object)bakimtespitleri : DBNull.Value;
            repRow["Diğer"] = diger.HasValue ? (object)diger : DBNull.Value;
            dtReport.Rows.Add(repRow);

            return dtReport;
        }

        public DataTable CBSParameters(CBSParameters p)
        {
            var dtReportParams = new DataTable("REPORTPARAMETERS");
            dtReportParams.Columns.AddRange(new[]
            {
                new DataColumn("ORGANIZATION", typeof(string)),
                new DataColumn("DEPARTMENT", typeof(string)),
                new DataColumn("REPORTUSER", typeof(string)),
                new DataColumn("HIDEPARAMETERS", typeof(string)),
                new DataColumn("TASKCOMPLETEDSTART", typeof(DateTime)),
                new DataColumn("TASKCOMPLETEDEND", typeof(DateTime)),
                new DataColumn("PSPONLY", typeof(string)),
                new DataColumn("REPORTDATE", typeof(DateTime)),
            });

            dtReportParams.Columns["ORGANIZATION"].AllowDBNull = true;
            dtReportParams.Columns["DEPARTMENT"].AllowDBNull = true;
            dtReportParams.Columns["REPORTUSER"].AllowDBNull = true;
            dtReportParams.Columns["TASKCOMPLETEDSTART"].AllowDBNull = true;
            dtReportParams.Columns["TASKCOMPLETEDEND"].AllowDBNull = true;
            dtReportParams.Columns["PSPONLY"].AllowDBNull = true;

            var repParamRow = dtReportParams.NewRow();
            repParamRow["ORGANIZATION"] = !string.IsNullOrEmpty(p.Organization) ? (object)p.Organization : "*";
            repParamRow["DEPARTMENT"] = !string.IsNullOrEmpty(p.Department) ? (object)p.Department : "*";
            repParamRow["PSPONLY"] = !string.IsNullOrEmpty(p.OnlyPSP) ? (object)p.OnlyPSP : "-";
            repParamRow["REPORTUSER"] = UserManager.Instance.User.Description;
            repParamRow["TASKCOMPLETEDSTART"] = p.TaskCompletedStart.HasValue
                ? (object)p.TaskCompletedStart
                : DBNull.Value;
            repParamRow["TASKCOMPLETEDEND"] = p.TaskCompletedEnd.HasValue ? (object)p.TaskCompletedEnd : DBNull.Value;
            repParamRow["REPORTDATE"] = DateTime.Now;
            repParamRow["HIDEPARAMETERS"] = p.HideParameters == '+' ? "+" : "-";

            dtReportParams.Rows.Add(repParamRow);

            return dtReportParams;
        }

        public DataTable CBSLines(IList<TMCUSTOMERSALES> lines)
        {
            var dtReport = new DataTable("REPORT");
            dtReport.Columns.AddRange(new[]
            {
                new DataColumn("CUS_NO", typeof(long)),
                new DataColumn("CUS_DESC"),
                new DataColumn("CUS_ACTIVE"),
                new DataColumn("CUS_TSKCNT", typeof(int)),
                new DataColumn("CUS_ACTCNT", typeof(int)),
                new DataColumn("CUS_AR_SUM", typeof(decimal)),
                new DataColumn("CUS_KO_SUM", typeof(decimal)),
                new DataColumn("CUS_ON_SUM", typeof(decimal)),
                new DataColumn("CUS_UY_SUM", typeof(decimal)),
                new DataColumn("CUS_UI_SUM", typeof(decimal)),
                new DataColumn("CUS_BK_SUM", typeof(decimal)),
                new DataColumn("CUS_TM_SUM", typeof(decimal)),
                new DataColumn("CUS_YGS_SUM", typeof(decimal)),
                new DataColumn("CUS_OZ_SUM", typeof(decimal)),
                new DataColumn("CUS_SA_SUM", typeof(decimal)),
                new DataColumn("CUS_YE_SUM", typeof(decimal)),
                new DataColumn("CUS_PROJELIISLER_SUM", typeof(decimal)),
                new DataColumn("CUS_BT_SUM", typeof(decimal)),
                new DataColumn("CUS_DGR_SUM", typeof(decimal)),
                new DataColumn("CUS_COST_SUM", typeof(decimal))
            });

            dtReport.Columns["CUS_AR_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_KO_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_ON_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_UY_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_UI_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_BK_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_TM_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_YGS_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_OZ_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_SA_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_YE_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_PROJELIISLER_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_BT_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_DGR_SUM"].AllowDBNull = true;
            dtReport.Columns["CUS_COST_SUM"].AllowDBNull = true;

            foreach (var linei in lines)
            {
                var repRow = dtReport.NewRow();
                repRow["CUS_NO"] = linei.CUS_NO;
                repRow["CUS_DESC"] = linei.CUS_DESC;
                repRow["CUS_ACTIVE"] = linei.CUS_ACTIVE;
                repRow["CUS_TSKCNT"] = linei.CUS_TSKCOUNT;
                repRow["CUS_ACTCNT"] = linei.CUS_ACTCOUNT;
                repRow["CUS_AR_SUM"] = linei.CUS_AR_SUM.HasValue ? (object)linei.CUS_AR_SUM : DBNull.Value;
                repRow["CUS_KO_SUM"] = linei.CUS_KO_SUM.HasValue ? (object)linei.CUS_KO_SUM : DBNull.Value;
                repRow["CUS_ON_SUM"] = linei.CUS_ON_SUM.HasValue ? (object)linei.CUS_ON_SUM : DBNull.Value;
                repRow["CUS_UY_SUM"] = linei.CUS_UY_SUM.HasValue ? (object)linei.CUS_UY_SUM : DBNull.Value;
                repRow["CUS_UI_SUM"] = linei.CUS_UI_SUM.HasValue ? (object)linei.CUS_UI_SUM : DBNull.Value;
                repRow["CUS_BK_SUM"] = linei.CUS_BK_SUM.HasValue ? (object)linei.CUS_BK_SUM : DBNull.Value;
                repRow["CUS_TM_SUM"] = linei.CUS_TM_SUM.HasValue ? (object)linei.CUS_TM_SUM : DBNull.Value;
                repRow["CUS_YGS_SUM"] = linei.CUS_YGS_SUM.HasValue ? (object)linei.CUS_YGS_SUM : DBNull.Value;
                repRow["CUS_OZ_SUM"] = linei.CUS_OZ_SUM.HasValue ? (object)linei.CUS_OZ_SUM : DBNull.Value;
                repRow["CUS_SA_SUM"] = linei.CUS_SA_SUM.HasValue ? (object)linei.CUS_SA_SUM : DBNull.Value;
                repRow["CUS_YE_SUM"] = linei.CUS_YE_SUM.HasValue ? (object)linei.CUS_YE_SUM : DBNull.Value;
                repRow["CUS_BT_SUM"] = linei.CUS_BT_SUM.HasValue ? (object)linei.CUS_BT_SUM : DBNull.Value;
                repRow["CUS_PROJELIISLER_SUM"] = linei.CUS_PROJELIISLER_SUM.HasValue
                    ? (object)linei.CUS_PROJELIISLER_SUM
                    : DBNull.Value;
                repRow["CUS_DGR_SUM"] = linei.CUS_DGR_SUM.HasValue ? (object)linei.CUS_DGR_SUM : DBNull.Value;
                repRow["CUS_COST_SUM"] = linei.CUS_COST_SUM.HasValue ? (object)linei.CUS_COST_SUM : DBNull.Value;

                dtReport.Rows.Add(repRow);
            }

            return dtReport;
        }
    }
}