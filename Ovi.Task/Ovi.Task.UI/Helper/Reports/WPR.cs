using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using CrystalDecisions.Shared.Json;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.UI.Helper.Reports
{
    public class WPR
    {
        public DataTable StatusLines(IList<TMTASKSTATUSDURATIONS> lines)
        {
            var dtLines = new DataTable("StatusLines");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("LINE", typeof(int)),
                new DataColumn("TSK", typeof(long)),
                new DataColumn("TSKDESC"),
                new DataColumn("TSKORG"),
                new DataColumn("TSKCREATED",typeof(DateTime)),
                new DataColumn("ORGDESC"),
                new DataColumn("CATDESC"),
                new DataColumn("CUSTOMER"),
                new DataColumn("BRANCHDESC"),
                new DataColumn("REQUESTED"),
                new DataColumn("STATUSDESC"),
                new DataColumn("TEKLIFASAMASI"),
                new DataColumn("SPROB"),
                new DataColumn("SPRT"),
                new DataColumn("SPRTAM"),
                new DataColumn("SPRA"),
                new DataColumn("SPRPA"),
                new DataColumn("SPRBEK"),
                new DataColumn("SPRPSP"),
                new DataColumn("SPRPSPK2"),
                new DataColumn("SPREKM"),
                new DataColumn("KALITE"),
                new DataColumn("HAKEDIS"),
                new DataColumn("OPERASYON"),
                new DataColumn("MUSTERIYONETIMI"),
                new DataColumn("HOLDDEPARTMENT"),
                new DataColumn("HOLDREASON"),
                new DataColumn("SATINALMA"),
                new DataColumn("FINANS"),
                new DataColumn("RAPORLAMA"),
                new DataColumn("TOTAL"),
                new DataColumn("TOTALCLOSED"),

                new DataColumn("KALITEDAKIKA"),
                new DataColumn("HAKEDISDAKIKA"),
                new DataColumn("OPERASYONDAKIKA"),
                new DataColumn("MUSTERIYONETIMIDAKIKA"),
                new DataColumn("SATINALMADAKIKA"),
                new DataColumn("FINANSDAKIKA"),
                new DataColumn("RAPORLAMADAKIKA"),
            });


            dtLines.Columns["SPROB"].AllowDBNull = true;
            dtLines.Columns["SPRT"].AllowDBNull = true;
            dtLines.Columns["SPRTAM"].AllowDBNull = true;
            dtLines.Columns["SPREKM"].AllowDBNull = true;
            dtLines.Columns["SPRA"].AllowDBNull = true;
            dtLines.Columns["SPRPA"].AllowDBNull = true;
            dtLines.Columns["SPRPSP"].AllowDBNull = true;
            dtLines.Columns["SPRPSPK2"].AllowDBNull = true;

            dtLines.Columns["TOTAL"].AllowDBNull = true;
            dtLines.Columns["TOTALCLOSED"].AllowDBNull = true;
            dtLines.Columns["TEKLIFASAMASI"].AllowDBNull = true;

            dtLines.Columns["KALITE"].AllowDBNull = true;
            dtLines.Columns["HAKEDIS"].AllowDBNull = true;
            dtLines.Columns["OPERASYON"].AllowDBNull = true;
            dtLines.Columns["MUSTERIYONETIMI"].AllowDBNull = true;
            dtLines.Columns["SATINALMA"].AllowDBNull = true;
            dtLines.Columns["FINANS"].AllowDBNull = true;
            dtLines.Columns["RAPORLAMA"].AllowDBNull = true;
            dtLines.Columns["HOLDDEPARTMENT"].AllowDBNull = true;
            dtLines.Columns["HOLDREASON"].AllowDBNull = true;

            int row = 0;
            foreach (var linei in lines)
            {
                var lineRow = dtLines.NewRow();

                row++;
                lineRow["LINE"] = row;
                lineRow["TSK"] = linei.SPR_TSK;
                lineRow["TSKDESC"] = linei.SPR_TSKDESC;
                lineRow["TSKORG"] = linei.SPR_TSKORG;
                lineRow["TSKCREATED"] = linei.SPR_TSKCREATED;
                lineRow["ORGDESC"] = linei.SPR_ORGDESC;
                lineRow["CATDESC"] = linei.SPR_CATDESC;
                lineRow["CUSTOMER"] = linei.SPR_CUSTOMER;
                lineRow["BRANCHDESC"] = linei.SPR_BRANCHDESC;
                lineRow["REQUESTED"] = linei.SPR_TSKREQUESTED;
                lineRow["STATUSDESC"] = linei.SPR_STATUSDESC;
                lineRow["SPROB"] = string.IsNullOrEmpty(linei.SPR_OB) ? (object)DBNull.Value : linei.SPR_OB;
                lineRow["SPRPSP"] = string.IsNullOrEmpty(linei.SPR_PSP) ? (object)DBNull.Value : linei.SPR_PSP;
                lineRow["SPRPSPK2"] = string.IsNullOrEmpty(linei.SPR_PSPK2) ? (object)DBNull.Value : linei.SPR_PSPK2;
                lineRow["SPRT"] = string.IsNullOrEmpty(linei.SPR_T) ? (object)DBNull.Value : linei.SPR_T;
                lineRow["SPRTAM"] = string.IsNullOrEmpty(linei.SPR_TAM) ? (object)DBNull.Value : linei.SPR_TAM;
                lineRow["SPRA"] = string.IsNullOrEmpty(linei.SPR_A) ? (object)DBNull.Value : linei.SPR_A;
                lineRow["SPRPA"] = string.IsNullOrEmpty(linei.SPR_PA) ? (object)DBNull.Value : linei.SPR_PA;
                lineRow["SPRBEK"] = string.IsNullOrEmpty(linei.SPR_BEK) ? (object)DBNull.Value : linei.SPR_BEK;
                lineRow["SPREKM"] = string.IsNullOrEmpty(linei.SPR_EKM) ? (object)DBNull.Value : linei.SPR_EKM;
                lineRow["HOLDDEPARTMENT"] = string.IsNullOrEmpty(linei.SPR_HOLDDEPARTMENT) ? (object)DBNull.Value : linei.SPR_HOLDDEPARTMENT;
                lineRow["HOLDREASON"] = string.IsNullOrEmpty(linei.SPR_HOLDREASON) ? (object)DBNull.Value : linei.SPR_HOLDREASON;
                lineRow["TEKLIFASAMASI"] = string.IsNullOrEmpty(linei.SPR_TEKLIFASAMASI) ? (object)DBNull.Value : linei.SPR_TEKLIFASAMASI;

                lineRow["KALITE"] = string.IsNullOrEmpty(linei.SPR_KALITE) ? (object)DBNull.Value : linei.SPR_KALITE;
                lineRow["HAKEDIS"] = string.IsNullOrEmpty(linei.SPR_HAKEDIS) ? (object)DBNull.Value : linei.SPR_HAKEDIS;
                lineRow["OPERASYON"] = string.IsNullOrEmpty(linei.SPR_OPERASYON) ? (object)DBNull.Value : linei.SPR_OPERASYON;
                lineRow["MUSTERIYONETIMI"] = string.IsNullOrEmpty(linei.SPR_MUSTERIYONETIMI) ? (object)DBNull.Value : linei.SPR_MUSTERIYONETIMI;
                lineRow["SATINALMA"] = string.IsNullOrEmpty(linei.SPR_SATINALMA) ? (object)DBNull.Value : linei.SPR_SATINALMA;
                lineRow["FINANS"] = string.IsNullOrEmpty(linei.SPR_FINANS) ? (object)DBNull.Value : linei.SPR_FINANS;
                lineRow["RAPORLAMA"] = string.IsNullOrEmpty(linei.SPR_RAPORLAMA) ? (object)DBNull.Value : linei.SPR_RAPORLAMA;

                lineRow["TOTAL"] = string.IsNullOrEmpty(linei.SPR_TOTAL) ? (object)DBNull.Value : linei.SPR_TOTAL;
                lineRow["TOTALCLOSED"] = string.IsNullOrEmpty(linei.SPR_TOTALCLOSED) ? (object)DBNull.Value : linei.SPR_TOTALCLOSED;

                lineRow["KALITEDAKIKA"] = linei.SPR_KALITEMINUTES;
                lineRow["FINANSDAKIKA"] = linei.SPR_FINANSMINUTES;
                lineRow["RAPORLAMADAKIKA"] = linei.SPR_RAPORLAMAMINUTES;
                lineRow["SATINALMADAKIKA"] = linei.SPR_SATINALMAMINUTES;
                lineRow["MUSTERIYONETIMIDAKIKA"] = linei.SPR_MUSTERIYONETIMIMINUTES;
                lineRow["HAKEDISDAKIKA"] = linei.SPR_HAKEDISMINUTES;
                lineRow["OPERASYONDAKIKA"] = linei.SPR_OPERASYONMINUTES;

                dtLines.Rows.Add(lineRow);
            }

            return dtLines;

        }

        public DataTable QuoLines(IList<TMQUOTATIONDURATIONS> lines)
        {
            var dtLines = new DataTable("QuotationLines");
            dtLines.Columns.AddRange(new[]
            {
                new DataColumn("TASK", typeof(int)),
                new DataColumn("QUOTATION", typeof(int)),
                new DataColumn("LASTSTATUS"),
                new DataColumn("B1"),
                new DataColumn("B2"),
                new DataColumn("BY"),
                new DataColumn("H"),
                new DataColumn("H2"),
                new DataColumn("R"),
                new DataColumn("SA"),
                new DataColumn("B3"),
            });


            dtLines.Columns["B1"].AllowDBNull = true;
            dtLines.Columns["B2"].AllowDBNull = true;
            dtLines.Columns["BY"].AllowDBNull = true;
            dtLines.Columns["H"].AllowDBNull = true;
            dtLines.Columns["H2"].AllowDBNull = true;
            dtLines.Columns["R"].AllowDBNull = true;
            dtLines.Columns["SA"].AllowDBNull = true;
            dtLines.Columns["B3"].AllowDBNull = true;

            
            foreach (var linei in lines)
            {
                var lineRow = dtLines.NewRow();

                lineRow["TASK"] = linei.QSP_TSKID;
                lineRow["QUOTATION"] = linei.QSP_QUOID;
                lineRow["LASTSTATUS"] = linei.QSP_STATUSDESC;
                lineRow["B1"] = string.IsNullOrEmpty(linei.QSP_B1) ? (object)DBNull.Value : linei.QSP_B1;
                lineRow["B2"] = string.IsNullOrEmpty(linei.QSP_B2) ? (object)DBNull.Value : linei.QSP_B2;
                lineRow["BY"] = string.IsNullOrEmpty(linei.QSP_BY) ? (object)DBNull.Value : linei.QSP_BY;
                lineRow["H"] = string.IsNullOrEmpty(linei.QSP_H) ? (object)DBNull.Value : linei.QSP_H;
                lineRow["H2"] = string.IsNullOrEmpty(linei.QSP_H2) ? (object)DBNull.Value : linei.QSP_H2;
                lineRow["R"] = string.IsNullOrEmpty(linei.QSP_R) ? (object)DBNull.Value : linei.QSP_R;
                lineRow["SA"] = string.IsNullOrEmpty(linei.QSP_SA) ? (object)DBNull.Value : linei.QSP_SA;
                lineRow["B3"] = string.IsNullOrEmpty(linei.QSP_B3) ? (object)DBNull.Value : linei.QSP_B3;
              

                dtLines.Rows.Add(lineRow);
            }

            return dtLines;

        }
    }
}