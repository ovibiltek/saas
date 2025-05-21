using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Web;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Controllers;

namespace Ovi.Task.UI.Helper.Reports
{
    public class CUS
    {

        public DataTable CUSHeader(CUSParameters cusParameters)
        {


            TMCUSTOMERS customer = null;
            TMCUSTOMERGROUPS customergroup = null;

            if (!string.IsNullOrEmpty(cusParameters.Customer))
            {
                var repositoryCustomers = new RepositoryCustomers();
                customer = repositoryCustomers.Get(cusParameters.Customer);
            }

            if (!string.IsNullOrEmpty(cusParameters.CustomerGroup))
            {
                var repositoryCustomerGroups = new RepositoryCustomerGroups();
                customergroup = repositoryCustomerGroups.Get(cusParameters.CustomerGroup);
            }

            var dtReportHeader = new DataTable("HEADER");
            dtReportHeader.Columns.AddRange(new[]
            {
                new DataColumn("TITLE", typeof(string)),
                new DataColumn("CUSTOMER", typeof(string)),
                new DataColumn("START", typeof(string)),
                new DataColumn("END", typeof(string)),

            });

            var repParamRow = dtReportHeader.NewRow();
            if ((cusParameters.TaskCompletedStart != null) && (cusParameters.TaskCompletedEnd != null))
                repParamRow["TITLE"] = string.Format("{0} - {1} AKTİVİTE RAPORU",
                    cusParameters.TaskCompletedStart.Value.ToString("dd MMMM yyyy", CultureInfo.CurrentCulture),
                    cusParameters.TaskCompletedEnd.Value.ToString("dd MMMM yyyy", CultureInfo.CurrentCulture));
            repParamRow["CUSTOMER"] = customer != null ? customer.CUS_DESC : customergroup.CUG_DESC;
            if (cusParameters.TaskCompletedStart != null)
                repParamRow["START"] = cusParameters.TaskCompletedStart.Value.ToString("dd MMMM yyyy", CultureInfo.CurrentCulture);
            if (cusParameters.TaskCompletedEnd != null)
                repParamRow["END"] = cusParameters.TaskCompletedEnd.Value.ToString("dd MMMM yyyy", CultureInfo.CurrentCulture);
            dtReportHeader.Rows.Add(repParamRow);

            return dtReportHeader;

        }

        public DataTable CUSSection1(CUSParameters cusParameters)
        {

            TMCUSTOMERS customer = null;
            TMCUSTOMERGROUPS customergroup = null;

            if (!string.IsNullOrEmpty(cusParameters.Customer))
            {
                var repositoryCustomers = new RepositoryCustomers();
                customer = repositoryCustomers.Get(cusParameters.Customer);
            }

            if (!string.IsNullOrEmpty(cusParameters.CustomerGroup))
            {
                var repositoryCustomerGroups = new RepositoryCustomerGroups();
                customergroup = repositoryCustomerGroups.Get(cusParameters.CustomerGroup);
            }

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section1lst = repositoryCustomerReport.ListSection1(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd
            });

            var dtReportSection1 = new DataTable("SECTION1");
            dtReportSection1.Columns.AddRange(new[]
            {
                new DataColumn("CUSTOMER", typeof(string)),
                new DataColumn("CUSTOMERGROUP", typeof(string)),
                new DataColumn("CUSTOMERCREATED", typeof(string)),
                new DataColumn("ACTIVEBRANCHCOUNT", typeof(int)),
                new DataColumn("CUSTOMERREP", typeof(string)),
                new DataColumn("TERM", typeof(int)),
                new DataColumn("BRNCOUNT", typeof(int)),
                new DataColumn("TSKCOUNT", typeof(int)),
                new DataColumn("ACTCOUNT", typeof(int)),
                new DataColumn("INTERNALAUDITCOUNT", typeof(int)),
                new DataColumn("PARTPSP", typeof(decimal)),
                new DataColumn("SERVICEPSP", typeof(decimal)),
                new DataColumn("TOTALPSP", typeof(decimal)),
                new DataColumn("K2TOTALPSP", typeof(decimal)),
                new DataColumn("H2TOTALPSP", typeof(decimal))
            });


            dtReportSection1.Columns["PARTPSP"].AllowDBNull = true;
            dtReportSection1.Columns["CUSTOMERGROUP"].AllowDBNull = true;
            dtReportSection1.Columns["CUSTOMERREP"].AllowDBNull = true;
            dtReportSection1.Columns["SERVICEPSP"].AllowDBNull = true;
            dtReportSection1.Columns["TOTALPSP"].AllowDBNull = true;
            dtReportSection1.Columns["K2TOTALPSP"].AllowDBNull = true;
            dtReportSection1.Columns["H2TOTALPSP"].AllowDBNull = true;

            foreach (var d in section1lst)
            {
                var repSection1Row = dtReportSection1.NewRow();
                repSection1Row["CUSTOMER"] = (customer != null ? customer.CUS_DESC : "-");
                repSection1Row["CUSTOMERGROUP"] = (customer != null ? customer.CUS_GROUPDESC : customergroup.CUG_DESC);
                repSection1Row["CUSTOMERREP"] = (customer != null && !string.IsNullOrEmpty(customer.CUS_PMMASTER) ? new RepositoryUsers().Get(customer.CUS_PMMASTER).USR_DESC : "-");
                repSection1Row["CUSTOMERCREATED"] = (customer != null ? customer.CUS_CREATED.ToString("dd MMMM yyyy", CultureInfo.CurrentCulture) : "-");
                repSection1Row["ACTIVEBRANCHCOUNT"] = d.SEC1_ACTIVEBRNCOUNT;
                if ((cusParameters.TaskCompletedEnd != null) && (cusParameters.TaskCompletedStart != null))
                    repSection1Row["TERM"] = (int)cusParameters.TaskCompletedEnd.Value.Subtract(cusParameters.TaskCompletedStart.Value).TotalDays;
                repSection1Row["BRNCOUNT"] = d.SEC1_BRNCOUNT;
                repSection1Row["TSKCOUNT"] = d.SEC1_TSKCOUNT;
                repSection1Row["ACTCOUNT"] = d.SEC1_ACTCOUNT;
                repSection1Row["INTERNALAUDITCOUNT"] = d.SEC1_INTERNALAUDITCOUNT;
                repSection1Row["PARTPSP"] = d.SEC1_PARTPSP.HasValue ? (object)d.SEC1_PARTPSP : DBNull.Value;
                repSection1Row["SERVICEPSP"] = d.SEC1_SERVICEPSP.HasValue ? (object)d.SEC1_SERVICEPSP : DBNull.Value;
                repSection1Row["TOTALPSP"] = d.SEC1_TOTALPSP.HasValue ? (object)d.SEC1_TOTALPSP : DBNull.Value;
                repSection1Row["K2TOTALPSP"] = d.SEC1_K2_TOTALPSP.HasValue ? (object)d.SEC1_K2_TOTALPSP : DBNull.Value;
                repSection1Row["H2TOTALPSP"] = d.SEC1_H2_TOTALPSP.HasValue ? (object)d.SEC1_H2_TOTALPSP : DBNull.Value;

                dtReportSection1.Rows.Add(repSection1Row);

            }
            return dtReportSection1;



        }

        public DataTable CUSSection2(CUSParameters cusParameters)
        {



            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section2lst = repositoryCustomerReport.ListSection2(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd
            });

            var dtReportSection2 = new DataTable("SECTION2");
            dtReportSection2.Columns.AddRange(new[]
            {
                new DataColumn("YEARMONTH", typeof(string)),
                new DataColumn("ACTCOUNT", typeof(int)),
                new DataColumn("TSKCOUNT", typeof(int)),
                new DataColumn("TOTALPSP", typeof(decimal)),
                new DataColumn("REGION", typeof(string)),
                new DataColumn("CATEGORY", typeof(string))
            });

            foreach (var d in section2lst)
            {
                var repSection2Row = dtReportSection2.NewRow();

                repSection2Row["YEARMONTH"] = string.Format("{0}.{1}", d.DAT_YEAR, d.DAT_MONTH);
                repSection2Row["ACTCOUNT"] = d.DAT_ACTCNT;
                repSection2Row["TSKCOUNT"] = d.DAT_TSKCNT;
                repSection2Row["TOTALPSP"] = d.DAT_TOTALPSP;
                repSection2Row["REGION"] = d.DAT_REGION;
                repSection2Row["CATEGORY"] = d.DAT_CATEGORY;

                dtReportSection2.Rows.Add(repSection2Row);

            }
            return dtReportSection2;

        }

        public DataTable CUSSection3(CUSParameters cusParameters)
        {

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section3lst = repositoryCustomerReport.ListSection3(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd,
                GetAll = string.IsNullOrEmpty(cusParameters.GetAll) ? '-' : Convert.ToChar(cusParameters.GetAll)
            });

            var dtReportSection3 = new DataTable("SECTION3");
            dtReportSection3.Columns.AddRange(new[]
            {
                new DataColumn("ROWNUM", typeof(int)),
                new DataColumn("BRANCH", typeof(string)),
                new DataColumn("PARTPSP", typeof(decimal)),
                new DataColumn("SERVICEPSP", typeof(decimal)),
                new DataColumn("TOTALPSP", typeof(decimal))
            });

            //if (section3lst.Count == 0)
            //    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));

            foreach (var d in section3lst)
            {
                var repSection3Row = dtReportSection3.NewRow();

                repSection3Row["ROWNUM"] = d.HGH_ROWNUM;
                repSection3Row["BRANCH"] = d.HGH_BRANCHDESC;
                repSection3Row["PARTPSP"] = d.HGH_PARTPSP;
                repSection3Row["SERVICEPSP"] = d.HGH_SERVICEPSP;
                repSection3Row["TOTALPSP"] = d.HGH_TOTALPSP;

                dtReportSection3.Rows.Add(repSection3Row);

            }
            return dtReportSection3;

        }

        public DataTable CUSSection4(CUSParameters cusParameters)
        {

            var repositoryCustomerPerformanceReport = new RepositoryCustomerPerformanceReport();
            var section4lst = repositoryCustomerPerformanceReport.List(new PerformanceReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd,
                Type = null
            });

            var dtReportSection4 = new DataTable("SECTION4");
            dtReportSection4.Columns.AddRange(new[]
            {
                new DataColumn("CATEGORY", typeof(string)),
                new DataColumn("AVGACTION", typeof(decimal)),
                new DataColumn("AVGPLANTIME", typeof(decimal)),
                new DataColumn("AVGCOMPLETED", typeof(decimal))
            });

            dtReportSection4.Columns["AVGACTION"].AllowDBNull = true;
            dtReportSection4.Columns["AVGPLANTIME"].AllowDBNull = true;
            dtReportSection4.Columns["AVGCOMPLETED"].AllowDBNull = true;

            //if (section4lst.Count == 0)
            //    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));

            foreach (var d in section4lst)
            {
                var repSection4Row = dtReportSection4.NewRow();

                repSection4Row["CATEGORY"] = d.CAT_DESC;
                repSection4Row["AVGACTION"] = d.CAT_AVGACTIONTIME.HasValue ? (object)d.CAT_AVGACTIONTIME : DBNull.Value;
                repSection4Row["AVGPLANTIME"] = d.CAT_AVGPLANTIME.HasValue ? (object)d.CAT_AVGPLANTIME : DBNull.Value;
                repSection4Row["AVGCOMPLETED"] = d.CAT_AVGCOMPLETEDTIME.HasValue ? (object)d.CAT_AVGCOMPLETEDTIME : DBNull.Value;

                dtReportSection4.Rows.Add(repSection4Row);

            }
            return dtReportSection4;

        }

        public DataTable CUSSection5(CUSParameters cusParameters)
        {

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section5lst = repositoryCustomerReport.ListSection4(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd,
                GetAll = string.IsNullOrEmpty(cusParameters.GetAll) ? '-' : Convert.ToChar(cusParameters.GetAll)
            });

            var dtReportSection5 = new DataTable("SECTION5");
            dtReportSection5.Columns.AddRange(new[]
            {
                new DataColumn("ROWNUM", typeof(int)),
                new DataColumn("CATEGORY", typeof(string)),
                new DataColumn("TASKTYPE", typeof(string)),
                new DataColumn("BRANCH", typeof(string)),
                new DataColumn("TOTALPSP", typeof(decimal))
            });

            //if (section5lst.Count == 0)
            //    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));

            foreach (var d in section5lst)
            {
                var repSection5Row = dtReportSection5.NewRow();

                repSection5Row["ROWNUM"] = d.HGH_ROWNUM;
                repSection5Row["BRANCH"] = d.HGH_BRANCHDESC;
                repSection5Row["CATEGORY"] = d.HGH_CATEGORYDESC;
                repSection5Row["TASKTYPE"] = d.HGH_TASKTYPEDESC;
                repSection5Row["TOTALPSP"] = d.HGH_TOTALPSP;

                dtReportSection5.Rows.Add(repSection5Row);

            }
            return dtReportSection5;

        }

        public DataTable CUSSection6(CUSParameters cusParameters)
        {

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section6lst = repositoryCustomerReport.ListSection5(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd,
                GetAll = string.IsNullOrEmpty(cusParameters.GetAll) ? '-' : Convert.ToChar(cusParameters.GetAll)
            });

            var dtReportSection6 = new DataTable("SECTION6");
            dtReportSection6.Columns.AddRange(new[]
            {
                new DataColumn("ROWNUM", typeof(int)),
                new DataColumn("CATEGORY", typeof(string)),
                new DataColumn("TASKTYPE", typeof(string)),
                new DataColumn("BRANCH", typeof(string)),
                new DataColumn("COUNT", typeof(int))
            });

            //if (section6lst.Count == 0)
            //    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));


            foreach (var d in section6lst)
            {
                var repSection6Row = dtReportSection6.NewRow();

                repSection6Row["ROWNUM"] = d.HGH_ROWNUM;
                repSection6Row["BRANCH"] = d.HGH_BRANCHDESC;
                repSection6Row["CATEGORY"] = d.HGH_CATEGORYDESC;
                repSection6Row["TASKTYPE"] = d.HGH_TASKTYPEDESC;
                repSection6Row["COUNT"] = d.HGH_COUNT;

                dtReportSection6.Rows.Add(repSection6Row);

            }
            return dtReportSection6;

        }

        public DataTable CUSSection7(CUSParameters cusParameters)
        {

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section7lst = repositoryCustomerReport.ListSection6(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd
            });

            var dtReportSection7 = new DataTable("SECTION7");
            dtReportSection7.Columns.AddRange(new[]
            {
                new DataColumn("Yıl.Ay", typeof(string)),
                new DataColumn("Ortalama Planlama", typeof(decimal)),
                new DataColumn("Ortalama Müdahale", typeof(decimal)),
                new DataColumn("Ortalama Çözüm", typeof(decimal))
            });

            dtReportSection7.Columns["Ortalama Planlama"].AllowDBNull = true;
            dtReportSection7.Columns["Ortalama Müdahale"].AllowDBNull = true;
            dtReportSection7.Columns["Ortalama Çözüm"].AllowDBNull = true;

            //if (section7lst.Count == 0)
            //    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));


            foreach (var d in section7lst)
            {
                var repSection7Row = dtReportSection7.NewRow();

                repSection7Row["Yıl.Ay"] = string.Format("{0}.{1}", d.TSK_YEAR, d.TSK_MONTH);
                repSection7Row["Ortalama Planlama"] = d.TSK_PLANNINGTIME.HasValue ? (object)d.TSK_PLANNINGTIME : DBNull.Value;
                repSection7Row["Ortalama Müdahale"] = d.TSK_ACTIONTIME.HasValue ? (object)d.TSK_ACTIONTIME : DBNull.Value;
                repSection7Row["Ortalama Çözüm"] = d.TSK_COMPLETEDTIME.HasValue ? (object)d.TSK_COMPLETEDTIME : DBNull.Value;

                dtReportSection7.Rows.Add(repSection7Row);

            }
            return dtReportSection7;

        }

        public DataTable CUSSection8(CUSParameters cusParameters)
        {

            var repositoryCustomerReport = new RepositoryCustomerReport();
            var section8lst = repositoryCustomerReport.ListSection7(new CustomerReportParameters
            {
                Customer = cusParameters.Customer,
                CustomerGroup = cusParameters.CustomerGroup,
                TaskCompletedStart = cusParameters.TaskCompletedStart,
                TaskCompletedEnd = cusParameters.TaskCompletedEnd
            });

            var dtReportSection8 = new DataTable("SECTION8");
            dtReportSection8.Columns.AddRange(new[]
            {
                new DataColumn("Yıl.Ay", typeof(string)),
                new DataColumn("Kategori", typeof(string)),
                new DataColumn("Toplam Sayı", typeof(int)),
                new DataColumn("Plana Uyum Sayısı", typeof(int)),
                new DataColumn("Revizyon Sayısı", typeof(int))
            });

            dtReportSection8.Columns["Toplam Sayı"].AllowDBNull = true;
            dtReportSection8.Columns["Plana Uyum Sayısı"].AllowDBNull = true;
            dtReportSection8.Columns["Revizyon Sayısı"].AllowDBNull = true;

            //if (section8lst.Count == 0)
            //    throw new TmsException(MessageHelper.Get("30021", UserManager.Instance.User.Language));


            foreach (var d in section8lst)
            {
                var repSection8Row = dtReportSection8.NewRow();

                repSection8Row["Yıl.Ay"] = string.Format("{0}.{1}", d.TSK_YEAR, d.TSK_MONTH);
                repSection8Row["Kategori"] = d.TSK_CATDESC;
                repSection8Row["Toplam Sayı"] = d.TSK_COUNT.HasValue ? (object)d.TSK_COUNT : DBNull.Value;
                repSection8Row["Plana Uyum Sayısı"] = d.TSK_PLANOK.HasValue ? (object)d.TSK_PLANOK : DBNull.Value;
                repSection8Row["Revizyon Sayısı"] = d.TSK_REVCOUNT.HasValue ? (object)d.TSK_REVCOUNT : DBNull.Value;

                dtReportSection8.Rows.Add(repSection8Row);

            }
            return dtReportSection8;

        }
    }
}