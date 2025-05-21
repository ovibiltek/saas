using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper.Reports
{
    public class SRP
    {
        public DataTable GetActivities(SRPParameters p)
        {

            var gr = new GridRequest
            {
                loadall = true,
                groupedFilters = new List<GridFilters>(),
                filter = new GridFilters { Filters = new List<GridFilter>(), Logic = "and" }
            };


            var gf = new GridFilters { Filters = new List<GridFilter>() };

            if (!string.IsNullOrEmpty(p.Organization))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKORGANIZATION", Operator = "eq", Value = p.Organization });
            }

            if (!string.IsNullOrEmpty(p.Customer))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKCUSTOMER", Operator = "eq", Value = p.Customer });
            }

            if (!string.IsNullOrEmpty(p.CustomerGroup))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKCUSTOMERGROUP", Operator = "eq", Value = p.CustomerGroup });
            }

            if (!string.IsNullOrEmpty(p.Branch))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKBRANCH", Operator = "eq", Value = p.Branch });
            }

            if (!string.IsNullOrEmpty(p.Tasktyp))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKTYPE", Operator = "eq", Value = p.Tasktyp });
            }

            if (!string.IsNullOrEmpty(p.Taskcategory))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKCATEGORY", Operator = "in", Value = new JArray(p.Taskcategory.Split(',')) });
            }

            if (!string.IsNullOrEmpty(p.Tasktype))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKTASKTYPE", Operator = "in", Value = new JArray(p.Tasktype.Split(',')) });
            }

            if (!string.IsNullOrEmpty(p.Trade))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSATRADE", Operator = "eq", Value = p.Trade });
            }

            if (!string.IsNullOrEmpty(p.Region))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_BRNREGION", Operator = "in", Value = new JArray(p.Region.Split(',')) });
            }

            if (!string.IsNullOrEmpty(p.Province))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_BRNPROVINCE", Operator = "in", Value = new JArray(p.Province.Split(',')) });
            }

            if (!string.IsNullOrEmpty(p.Supplier))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TRDSUPPLIER", Operator = "eq", Value = p.Supplier });
            }

            if (!string.IsNullOrEmpty(p.ActivityDepartment))
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSADEPARTMENT", Operator = "eq", Value = p.ActivityDepartment });
            }

            if (p.TaskCompletedStart.HasValue && p.TaskCompletedEnd.HasValue)
            {
                gf.Filters.Add(new GridFilter
                {
                    Field = "SRP_TSKCOMPLETED",
                    Operator = "between",
                    Value = p.TaskCompletedStart.Value.Date,
                    Value2 = p.TaskCompletedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                });
            }
            else if (p.TaskCompletedStart.HasValue)
            {
                gf.Filters.Add(new GridFilter
                {
                    Field = "SRP_TSKCOMPLETED",
                    Operator = "gte",
                    Value = p.TaskCompletedStart.Value.Date,
                });
            }
            else if (p.TaskCompletedEnd.HasValue)
            {
                gf.Filters.Add(new GridFilter
                {
                    Field = "SRP_TSKCOMPLETED",
                    Operator = "lte",
                    Value = p.TaskCompletedEnd.Value.Date
                });
            }

            if (!string.IsNullOrEmpty(p.OnlyPSP) && p.OnlyPSP == "+")
            {
                gf.Filters.Add(new GridFilter { Field = "SRP_TSKPSPCODE", Operator = "isnotnull" });
            }

            gr.groupedFilters.Add(gf);

            var gf2 = new GridFilters { Filters = new List<GridFilter>(), Logic = "or" };

            if (!string.IsNullOrEmpty(p.OnlyCustomers) && p.OnlyCustomers == "+")
            {
                gf2.Filters.Add(new GridFilter
                { Field = "SRP_TSKCUSTOMER", Value = "GUNDEMIR", Operator = "doesnotcontain", Logic = "or" });
                gf2.Filters.Add(new GridFilter
                { Field = "SRP_TSKCUSTOMER", Value = "GUNDEMIR.DIGER", Operator = "eq", Logic = "or" });

            }

            var repositoryServiceReportLines = new RepositoryServiceReportLines();
            var lines = repositoryServiceReportLines.List(gr);

            var dtActivities = new DataTable("ACT");
            dtActivities.Columns.AddRange(new[]
            {
                new DataColumn("ORGANIZATION"),
                new DataColumn("TSKID"),
                new DataColumn("CUSTOMER"),
                new DataColumn("CUSTOMERPM"),
                new DataColumn("CUSTOMERCREATED"),
                new DataColumn("BRANCH"),
                new DataColumn("TYPE"),
                new DataColumn("CATEGORY"),
                new DataColumn("TASKTYPE"),
                new DataColumn("REGION"),
                new DataColumn("PROVINCE"),
                new DataColumn("CREATEDBY"),
                new DataColumn("CREATED"),
                new DataColumn("COMPLETED"),
                new DataColumn("COMPLETEDMY"),
                new DataColumn("LINE"),
                new DataColumn("LINEDESC"),
                new DataColumn("ACTDEPARTMENT"),
                new DataColumn("ACTCOMPLETED"),
                new DataColumn("TRADE"),
                new DataColumn("SUPPLIER"),
                new DataColumn("PSPCODE"),
                new DataColumn("PSPSTATUS"),
                new DataColumn("OPETIME"),
                new DataColumn("LABORCOST", typeof(decimal)),
                new DataColumn("LABORCALC", typeof(decimal)),
                new DataColumn("LABORPSP", typeof(decimal)),
                new DataColumn("SERVCALC", typeof(decimal)),
                new DataColumn("SERVPSP", typeof(decimal)),
                new DataColumn("MISCCOSTRECEIVE_PART", typeof(decimal)),
                new DataColumn("MISCCOSTSALES_PART", typeof(decimal)),
                new DataColumn("MISCCOSTPSP_PART", typeof(decimal)),
                new DataColumn("MISCCOSTRECEIVE_SERVICE", typeof(decimal)),
                new DataColumn("MISCCOSTSALES_SERVICE", typeof(decimal)),
                new DataColumn("MISCCOSTPSP_SERVICE", typeof(decimal)),
                new DataColumn("SERVICECODERECEIVE", typeof(decimal)),
                new DataColumn("SERVICECODESALES", typeof(decimal)),
                new DataColumn("SERVICECODEPSP", typeof(decimal)),
                new DataColumn("EQUIPMENTRECEIVE", typeof(decimal)),
                new DataColumn("EQUIPMENTSALES", typeof(decimal)),
                new DataColumn("EQUIPMENTPSP", typeof(decimal)),
                new DataColumn("PARTRECEIVE", typeof(decimal)),
                new DataColumn("PARTPSP", typeof(decimal)),
                new DataColumn("TOTALCOST", typeof(decimal)),
                new DataColumn("TOTALPSP", typeof(decimal)),
                new DataColumn("RETURN", typeof(decimal))
            });

            foreach (var linei in lines)
            {
                var actRow = dtActivities.NewRow();
                actRow["ORGANIZATION"] = linei.SRP_TSKORGANIZATION;
                actRow["TSKID"] = linei.SRP_TSKID;
                actRow["CUSTOMER"] = linei.SRP_TSKCUSTOMERDESC;
                actRow["CUSTOMERPM"] = linei.SRP_TSKCUSTOMERPM;
                actRow["CUSTOMERCREATED"] = linei.SRP_TSKCUSTOMERCREATED;
                actRow["BRANCH"] = linei.SRP_TSKBRANCHDESC;
                actRow["TYPE"] = linei.SRP_TSKTYPE;
                actRow["CATEGORY"] = linei.SRP_TSKCATEGORYDESC;
                actRow["TASKTYPE"] = linei.SRP_TSKTASKTYPE;
                actRow["REGION"] = linei.SRP_BRNREGION;
                actRow["PROVINCE"] = linei.SRP_ADSDESC;
                actRow["CREATEDBY"] = linei.SRP_TSKCREATEDBY;
                actRow["CREATED"] = linei.SRP_TSKCREATED;
                actRow["COMPLETED"] = linei.SRP_TSKCOMPLETED;
                actRow["COMPLETEDMY"] = linei.SRP_TSKCOMPLETEDMY;
                actRow["ACTDEPARTMENT"] = linei.SRP_TSADEPARTMENT;
                actRow["ACTCOMPLETED"] = linei.SRP_TSADATECOMPLETED;
                actRow["LINE"] = linei.SRP_TSALINE;
                actRow["LINEDESC"] = linei.SRP_TSADESC;
                actRow["TRADE"] = linei.SRP_TSATRADE;
                actRow["SUPPLIER"] = linei.SRP_TRDSUPPLIER;
                actRow["PSPCODE"] = linei.SRP_TSKPSPCODE;
                actRow["PSPSTATUS"] = linei.SRP_TSKPSPSTATUSDESC;
                actRow["OPETIME"] = linei.SRP_OPETIME;
                actRow["LABORCOST"] = linei.SRP_LABORCOST;
                actRow["LABORCALC"] = linei.SRP_LABORCALC;
                actRow["LABORPSP"] = linei.SRP_LABORPSP;
                actRow["SERVCALC"] = linei.SRP_SERVCALC;
                actRow["SERVPSP"] = linei.SRP_SERVPSP;
                actRow["SERVICECODERECEIVE"] = linei.SRP_SERVICECODERECEIVE;
                actRow["SERVICECODESALES"] = linei.SRP_SERVICECODESALES;
                actRow["SERVICECODEPSP"] = linei.SRP_SERVICECODEPSP;
                actRow["EQUIPMENTRECEIVE"] = linei.SRP_EQUIPMENTRECEIVE;
                actRow["EQUIPMENTSALES"] = linei.SRP_EQUIPMENTSALES;
                actRow["EQUIPMENTPSP"] = linei.SRP_EQUIPMENTPSP;
                actRow["MISCCOSTRECEIVE_PART"] = linei.SRP_MISCCOSTRECEIVE_PART;
                actRow["MISCCOSTSALES_PART"] = linei.SRP_MISCCOSTSALES_PART;
                actRow["MISCCOSTPSP_PART"] = linei.SRP_MISCCOSTPSP_PART;
                actRow["MISCCOSTRECEIVE_SERVICE"] = linei.SRP_MISCCOSTRECEIVE_SERVICE;
                actRow["MISCCOSTSALES_SERVICE"] = linei.SRP_MISCCOSTSALES_SERVICE;
                actRow["MISCCOSTPSP_SERVICE"] = linei.SRP_MISCCOSTPSP_SERVICE;
                actRow["PARTRECEIVE"] = linei.SRP_PARTRECEIVE;
                actRow["PARTPSP"] = linei.SRP_PARTPSP;
                actRow["TOTALCOST"] = linei.SRP_TOTALCOST;
                actRow["TOTALPSP"] = linei.SRP_TOTALPSP;
                actRow["RETURN"] = linei.SRP_INVRETURN;

                dtActivities.Rows.Add(actRow);
            }

            return dtActivities;
        }
    }
}