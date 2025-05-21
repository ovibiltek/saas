using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Mapping.Task;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper.Reports
{
    public class DBT
    {
        public DataTable DBTParameters(DBTParameters p)
        {
            var dt = new DataTable("PARAMETERS");

            dt.Columns.AddRange(new[]
            {
                new DataColumn("DEPARTMENT"),
                new DataColumn("MONTH"),
                new DataColumn("YEAR")
            });


            var dtRow = dt.NewRow();

            RepositoryDepartments repositoryDepartments = new RepositoryDepartments();

            dtRow["DEPARTMENT"] = repositoryDepartments.Get(p.Department).DEP_DESCF;
            dtRow["MONTH"] = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(p.Date.Month);
            dtRow["YEAR"] = p.Date.Year.ToString();

            dt.Rows.Add(dtRow);
            return dt;
        }


        public DataTable DBTSection1(IList<TMTASKLISTVIEW> tasks,DBTParameters p)
        {
            var dtSection1 = new DataTable("SECTION1");


            dtSection1.Columns.AddRange(new[]
            {
                new DataColumn("DATE"),
                new DataColumn("ARIZA",typeof(int)),
                new DataColumn("BILGI",typeof(int)),
                new DataColumn("DESTEK" ,typeof(int))
            });


            var dtRow = dtSection1.NewRow();

            dtRow["DATE"] = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(p.Date.Month)+ " " + p.Date.Year.ToString();
            dtRow["ARIZA"] = tasks.Count(x=> x.TSK_TYPE == "DIS");
            dtRow["BILGI"] = tasks.Count(x=> x.TSK_TYPE == "BILGI");
            dtRow["DESTEK"] = tasks.Count(x => x.TSK_TYPE == "UZAK");
            
            dtSection1.Rows.Add(dtRow);
           
            return dtSection1;
        }

        public DataTable DBTSection2(IList<TMTASKLISTVIEW> tasks)
        {
            var dtSection2 = new DataTable("SECTION2");

            dtSection2.Columns.AddRange(new[]
            {
                new DataColumn("REGION"),
                new DataColumn("ARIZA",typeof(int)),
                new DataColumn("BILGI",typeof(int)),
                new DataColumn("DESTEK",typeof(int))
            });

            var grouped = tasks.GroupBy(x => x.TSK_REGION);

            foreach (var line in grouped)
            {
                var dtRow = dtSection2.NewRow();
                dtRow["REGION"] = line.Key;
                dtRow["ARIZA"] = line.Count(x => x.TSK_TYPE == "DIS");
                dtRow["BILGI"] = line.Count(x => x.TSK_TYPE == "BILGI");
                dtRow["DESTEK"] = line.Count(x => x.TSK_TYPE == "UZAK");

                dtSection2.Rows.Add(dtRow);
            }



            return dtSection2;
        }

        public DataTable DBTSection3(IList<TMTASKLISTVIEW> tasks)
        {
            var dtSection3 = new DataTable("SECTION3");

            dtSection3.Columns.AddRange(new[]
            {
                new DataColumn("CUSTOMERANDREGION"),
                new DataColumn("ARIZA",typeof(int)),
                new DataColumn("BILGI",typeof(int)),
                new DataColumn("DESTEK",typeof(int))
            });

            var grouped = tasks.GroupBy(x => new { x.TSK_REGION,x.TSK_CUSTOMER});

            foreach (var line in grouped)
            {
                var dtRow = dtSection3.NewRow();
                dtRow["CUSTOMERANDREGION"] = line.Key.TSK_REGION + " " + line.Key.TSK_CUSTOMER;
                dtRow["ARIZA"] = line.Count(x => x.TSK_TYPE == "DIS");
                dtRow["BILGI"] = line.Count(x => x.TSK_TYPE == "BILGI");
                dtRow["DESTEK"] = line.Count(x => x.TSK_TYPE == "UZAK");

                dtSection3.Rows.Add(dtRow);
            }



            return dtSection3;
        }

        public DataTable DBTSection4(IList<TMTASKLISTVIEW> tasks)
        {
            var dtSection4 = new DataTable("SECTION4");

            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("CREATEDBY"),
                new DataColumn("ARIZA",typeof(int)),
                new DataColumn("BILGI",typeof(int)),
                new DataColumn("DESTEK",typeof(int))
            });

            var grouped = tasks.GroupBy(x => x.TSK_CREATEDBY);

            foreach (var line in grouped)
            {
                var dtRow = dtSection4.NewRow();
                dtRow["CREATEDBY"] = line.Key;
                dtRow["ARIZA"] = line.Count(x => x.TSK_TYPE == "DIS");
                dtRow["BILGI"] = line.Count(x => x.TSK_TYPE == "BILGI");
                dtRow["DESTEK"] = line.Count(x => x.TSK_TYPE == "UZAK");

                dtSection4.Rows.Add(dtRow);
            }



            return dtSection4;
        }
    }
}