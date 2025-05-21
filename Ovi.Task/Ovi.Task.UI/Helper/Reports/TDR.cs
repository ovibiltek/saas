using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper.Reports
{
    public class TDR
    {
        public DataTable TDRParameters(TDRParameters p)
        {
            var dtParameters = new DataTable("PARAMETERS");

            dtParameters.Columns.AddRange(new[]
            {
                new DataColumn("ORG"),
                new DataColumn("DEP"),
                new DataColumn("CREATED"),
                new DataColumn("COMPLETED"),
                new DataColumn("TYPE"),
                new DataColumn("CATEGORY"),
                new DataColumn("TASKTYPE"),
                new DataColumn("CUSTOMER"),
                new DataColumn("CUSTOMERGROUP"),
                new DataColumn("BRANCH"),
                new DataColumn("PROVINCE"),
                new DataColumn("STATUS"),
                new DataColumn("PASSEDDAYSLIMIT"),
                new DataColumn("REPORTEDBY"),
                new DataColumn("REPORTEDAT"),
                new DataColumn("REGION")
            });

            var parametersRow = dtParameters.NewRow();
            parametersRow["ORG"] = p.Organization;
            parametersRow["DEP"] = p.Department;
            parametersRow["CREATED"] = (p.TaskCreatedStart.HasValue ? p.TaskCreatedStart.Value.ToString("dd.MM.yyyy") : "") + " - " + (p.TaskCreatedEnd.HasValue ? p.TaskCreatedEnd.Value.ToString("dd.MM.yyyy") : "");
            parametersRow["COMPLETED"] = (p.TaskCompletedStart.HasValue ? p.TaskCompletedStart.Value.ToString("dd.MM.yyyy") : "") + " - " + (p.TaskCompletedEnd.HasValue ? p.TaskCompletedEnd.Value.ToString("dd.MM.yyyy") : "");
            parametersRow["TYPE"] = p.Type;
            parametersRow["CATEGORY"] = p.Category;
            parametersRow["TASKTYPE"] = p.TaskType;
            parametersRow["CUSTOMER"] = p.Customer;
            parametersRow["CUSTOMERGROUP"] = p.CustomerGroup;
            parametersRow["BRANCH"] = p.Branch;
            parametersRow["PROVINCE"] = p.Province;
            parametersRow["STATUS"] = p.Status;
            parametersRow["PASSEDDAYSLIMIT"] = p.PassedDaysLimit;
            parametersRow["REPORTEDBY"] = UserManager.Instance.User.Description;
            parametersRow["REPORTEDAT"] = DateTime.Now;
            parametersRow["REGION"] = p.Region;

            dtParameters.Rows.Add(parametersRow);
            return dtParameters;
        }

        public DataTable TDRSection1(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section1List = repositoryTaskDetailReport.ListSection1(new TaskDetailParameters()
            {
                Organization= p.Organization,
                Department= p.Department,
                PassedDaysLimit= p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category= p.Category,
                Type= p.Type,
                TaskType= p.TaskType,
                TaskCompletedEnd= p.TaskCompletedEnd,
                TaskCompletedStart= p.TaskCompletedStart,
                TaskCreatedEnd    = p.TaskCreatedEnd,
                TaskCreatedStart= p.TaskCreatedStart,
                CustomerGroup= p.CustomerGroup,
                Province = p.Province,
                Region= p.Region,
                Status= p.Status,
                Supplier= p.Supplier,
            });
            var dtSection1 = new DataTable("SECTION1");
            dtSection1.Columns.AddRange(new[]
            {
                new DataColumn("SEC1_REGION",typeof(string)),
                new DataColumn("SEC1_BILGIACIK",typeof(int)),
                new DataColumn("SEC1_BILGITAMAM",typeof(int)),
                new DataColumn("SEC1_BILGIIPTAL",typeof(int)),
                new DataColumn("SEC1_UZAKACIK",typeof(int)),
                new DataColumn("SEC1_UZAKTAMAM",typeof(int)),
                new DataColumn("SEC1_UZAKIPTAL",typeof(int)),
                new DataColumn("SEC1_DISACIK",typeof(int)),
                new DataColumn("SEC1_DISTAMAM",typeof(int)),
                new DataColumn("SEC1_DISIPTAL",typeof(int)),
                new DataColumn("SEC1_DIGERACIK",typeof(int)),
                new DataColumn("SEC1_DIGERTAMAM",typeof(int)),
                new DataColumn("SEC1_DIGERIPTAL",typeof(int)),
            });

           

            foreach (var d in section1List)
            {
                var section1Row = dtSection1.NewRow();
                section1Row["SEC1_REGION"] = d.SEC1_REGION;
                section1Row["SEC1_BILGIACIK"] = d.SEC1_BILGIACIK;
                section1Row["SEC1_BILGITAMAM"] = d.SEC1_BILGITAMAM;
                section1Row["SEC1_BILGIIPTAL"] = d.SEC1_BILGIIPTAL;
                section1Row["SEC1_UZAKACIK"] = d.SEC1_UZAKACIK;
                section1Row["SEC1_UZAKTAMAM"] = d.SEC1_UZAKTAMAM;
                section1Row["SEC1_UZAKIPTAL"] = d.SEC1_UZAKIPTAL;
                section1Row["SEC1_DISACIK"] = d.SEC1_DISACIK;
                section1Row["SEC1_DISTAMAM"] = d.SEC1_DISTAMAM;
                section1Row["SEC1_DISIPTAL"] = d.SEC1_DISIPTAL;
                section1Row["SEC1_DIGERACIK"] = d.SEC1_DIGERACIK;
                section1Row["SEC1_DIGERTAMAM"] = d.SEC1_DIGERTAMAM;
                section1Row["SEC1_DIGERIPTAL"] = d.SEC1_DIGERIPTAL;

                dtSection1.Rows.Add(section1Row);
            }

            return dtSection1;
        }

        public DataTable TDRSection2(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section2List = repositoryTaskDetailReport.ListSection2(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection2 = new DataTable("SECTION2");
            dtSection2.Columns.AddRange(new[]
            {
                new DataColumn("SEC2_REGION",typeof(string)),
                new DataColumn("SEC2_TRADE",typeof(string)),
                new DataColumn("SEC2_BILGIACIK",typeof(int)),
                new DataColumn("SEC2_BILGITAMAM",typeof(int)),
                new DataColumn("SEC2_BILGIIPTAL",typeof(int)),
                new DataColumn("SEC2_UZAKACIK",typeof(int)),
                new DataColumn("SEC2_UZAKTAMAM",typeof(int)),
                new DataColumn("SEC2_UZAKIPTAL",typeof(int)),
                new DataColumn("SEC2_DISACIK",typeof(int)),
                new DataColumn("SEC2_DISTAMAM",typeof(int)),
                new DataColumn("SEC2_DISIPTAL",typeof(int)),
                new DataColumn("SEC2_DIGERACIK",typeof(int)),
                new DataColumn("SEC2_DIGERTAMAM",typeof(int)),
                new DataColumn("SEC2_DIGERIPTAL",typeof(int)),
                new DataColumn("SEC2_TRADEUSERS",typeof(string))
            });



            foreach (var d in section2List)
            {
                var section2Row = dtSection2.NewRow();
                section2Row["SEC2_REGION"] = d.SEC2_REGION;
                section2Row["SEC2_TRADE"] = d.SEC2_TRADE;
                section2Row["SEC2_BILGIACIK"] = d.SEC2_BILGIACIK;
                section2Row["SEC2_BILGITAMAM"] = d.SEC2_BILGITAMAM;
                section2Row["SEC2_BILGIIPTAL"] = d.SEC2_BILGIIPTAL;
                section2Row["SEC2_UZAKACIK"] = d.SEC2_UZAKACIK;
                section2Row["SEC2_UZAKTAMAM"] = d.SEC2_UZAKTAMAM;
                section2Row["SEC2_UZAKIPTAL"] = d.SEC2_UZAKIPTAL;
                section2Row["SEC2_DISACIK"] = d.SEC2_DISACIK;
                section2Row["SEC2_DISTAMAM"] = d.SEC2_DISTAMAM;
                section2Row["SEC2_DISIPTAL"] = d.SEC2_DISIPTAL;
                section2Row["SEC2_DIGERACIK"] = d.SEC2_DIGERACIK;
                section2Row["SEC2_DIGERTAMAM"] = d.SEC2_DIGERTAMAM;
                section2Row["SEC2_DIGERIPTAL"] = d.SEC2_DIGERIPTAL;
                section2Row["SEC2_TRADEUSERS"] = d.SEC2_TRADEUSERS;

                dtSection2.Rows.Add(section2Row);
            }

            return dtSection2;
        }

        public DataTable TDRSection3(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section3List = repositoryTaskDetailReport.ListSection3(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection3 = new DataTable("SECTION3");
            dtSection3.Columns.AddRange(new[]
            {
                new DataColumn("SEC3_CUSTOMER",typeof(string)),
               
                new DataColumn("SEC3_BILGIACIK",typeof(int)),
                new DataColumn("SEC3_BILGITAMAM",typeof(int)),
                new DataColumn("SEC3_BILGIIPTAL",typeof(int)),
                new DataColumn("SEC3_UZAKACIK",typeof(int)),
                new DataColumn("SEC3_UZAKTAMAM",typeof(int)),
                new DataColumn("SEC3_UZAKIPTAL",typeof(int)),
                new DataColumn("SEC3_DISACIK",typeof(int)),
                new DataColumn("SEC3_DISTAMAM",typeof(int)),
                new DataColumn("SEC3_DISIPTAL",typeof(int)),
                new DataColumn("SEC3_DIGERACIK",typeof(int)),
                new DataColumn("SEC3_DIGERTAMAM",typeof(int)),
                new DataColumn("SEC3_DIGERIPTAL",typeof(int)),
            });



            foreach (var d in section3List)
            {
                var section3Row = dtSection3.NewRow();
                section3Row["SEC3_CUSTOMER"] = d.SEC3_CUSTOMER;
            
                section3Row["SEC3_BILGIACIK"] = d.SEC3_BILGIACIK;
                section3Row["SEC3_BILGITAMAM"] = d.SEC3_BILGITAMAM;
                section3Row["SEC3_BILGIIPTAL"] = d.SEC3_BILGIIPTAL;
                section3Row["SEC3_UZAKACIK"] = d.SEC3_UZAKACIK;
                section3Row["SEC3_UZAKTAMAM"] = d.SEC3_UZAKTAMAM;
                section3Row["SEC3_UZAKIPTAL"] = d.SEC3_UZAKIPTAL;
                section3Row["SEC3_DISACIK"] = d.SEC3_DISACIK;
                section3Row["SEC3_DISTAMAM"] = d.SEC3_DISTAMAM;
                section3Row["SEC3_DISIPTAL"] = d.SEC3_DISIPTAL;
                section3Row["SEC3_DIGERACIK"] = d.SEC3_DIGERACIK;
                section3Row["SEC3_DIGERTAMAM"] = d.SEC3_DIGERTAMAM;
                section3Row["SEC3_DIGERIPTAL"] = d.SEC3_DIGERIPTAL;

                dtSection3.Rows.Add(section3Row);
            }

            return dtSection3;
        }

        public DataTable TDRSection4(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section4List = repositoryTaskDetailReport.ListSection4(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection4 = new DataTable("SECTION4");
            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("SEC4_CUSTOMER",typeof(string)),

                new DataColumn("SEC4_ADANAACIK",typeof(int)),
                new DataColumn("SEC4_ADANATAMAM",typeof(int)),
                new DataColumn("SEC4_ADANAIPTAL",typeof(int)),
                new DataColumn("SEC4_ANTALYAACIK",typeof(int)),
                new DataColumn("SEC4_ANTALYATAMAM",typeof(int)),
                new DataColumn("SEC4_ANTALYAIPTAL",typeof(int)),
                new DataColumn("SEC4_IZMIRACIK",typeof(int)),
                new DataColumn("SEC4_IZMIRTAMAM",typeof(int)),
                new DataColumn("SEC4_IZMIRIPTAL",typeof(int)),
                new DataColumn("SEC4_ISTANBULACIK",typeof(int)),
                new DataColumn("SEC4_ISTANBULTAMAM",typeof(int)),
                new DataColumn("SEC4_ISTANBULIPTAL",typeof(int)),
                new DataColumn("SEC4_DIGERACIK",typeof(int)),
                new DataColumn("SEC4_DIGERTAMAM",typeof(int)),
                new DataColumn("SEC4_DIGERIPTAL",typeof(int)),
            });



            foreach (var d in section4List)
            {
                var section4Row = dtSection4.NewRow();
                section4Row["SEC4_CUSTOMER"] = d.SEC4_CUSTOMER;

                section4Row["SEC4_ADANAACIK"] = d.SEC4_ADANAACIK;
                section4Row["SEC4_ADANATAMAM"] = d.SEC4_ADANATAMAM;
                section4Row["SEC4_ADANAIPTAL"] = d.SEC4_ADANAIPTAL;
                section4Row["SEC4_ANTALYAACIK"] = d.SEC4_ANTALYAACIK;
                section4Row["SEC4_ANTALYATAMAM"] = d.SEC4_ANTALYATAMAM;
                section4Row["SEC4_ANTALYAIPTAL"] = d.SEC4_ANTALYAIPTAL;
                section4Row["SEC4_IZMIRACIK"] = d.SEC4_IZMIRACIK;
                section4Row["SEC4_IZMIRTAMAM"] = d.SEC4_IZMIRTAMAM;
                section4Row["SEC4_IZMIRIPTAL"] = d.SEC4_IZMIRIPTAL;
                section4Row["SEC4_ISTANBULACIK"] = d.SEC4_ISTANBULACIK;
                section4Row["SEC4_ISTANBULTAMAM"] = d.SEC4_ISTANBULTAMAM;
                section4Row["SEC4_ISTANBULIPTAL"] = d.SEC4_ISTANBULIPTAL;
                section4Row["SEC4_DIGERACIK"] = d.SEC4_DIGERACIK;
                section4Row["SEC4_DIGERTAMAM"] = d.SEC4_DIGERTAMAM;
                section4Row["SEC4_DIGERIPTAL"] = d.SEC4_DIGERIPTAL;

                dtSection4.Rows.Add(section4Row);
            }

            return dtSection4;
        }
        public DataTable TDRRegionalSection4(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section4List = repositoryTaskDetailReport.ListRegionalSection4(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection4 = new DataTable("REGIONALSECTION4");
            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("SEC4_CUSTOMER",typeof(string)),

                new DataColumn("SEC4_ACIK",typeof(int)),
                new DataColumn("SEC4_TAMAM",typeof(int)),
                new DataColumn("SEC4_IPTAL",typeof(int)),
               
            });



            foreach (var d in section4List)
            {
                var section4Row = dtSection4.NewRow();
                section4Row["SEC4_CUSTOMER"] = d.SEC4_CUSTOMER;

                section4Row["SEC4_ACIK"] = d.SEC4_ACIK;
                section4Row["SEC4_TAMAM"] = d.SEC4_TAMAM;
                section4Row["SEC4_IPTAL"] = d.SEC4_IPTAL;
           

                dtSection4.Rows.Add(section4Row);
            }

            return dtSection4;
        }

        public DataTable TDRSection5(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section5List = repositoryTaskDetailReport.ListSection5(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection5 = new DataTable("SECTION5");
            dtSection5.Columns.AddRange(new[]
            {
                new DataColumn("SEC5_CUSTOMER",typeof(string)),

                new DataColumn("SEC5_ADANAARIZA",typeof(int)),
                new DataColumn("SEC5_ADANABAKIM",typeof(int)),
                new DataColumn("SEC5_ADANADIGER",typeof(int)),
                new DataColumn("SEC5_ANTALYAARIZA",typeof(int)),
                new DataColumn("SEC5_ANTALYABAKIM",typeof(int)),
                new DataColumn("SEC5_ANTALYADIGER",typeof(int)),
                new DataColumn("SEC5_IZMIRARIZA",typeof(int)),
                new DataColumn("SEC5_IZMIRBAKIM",typeof(int)),
                new DataColumn("SEC5_IZMIRDIGER",typeof(int)),
                new DataColumn("SEC5_ISTANBULARIZA",typeof(int)),
                new DataColumn("SEC5_ISTANBULBAKIM",typeof(int)),
                new DataColumn("SEC5_ISTANBULDIGER",typeof(int)),
                new DataColumn("SEC5_DIGERARIZA",typeof(int)),
                new DataColumn("SEC5_DIGERBAKIM",typeof(int)),
                new DataColumn("SEC5_DIGERDIGER",typeof(int)),
            });



            foreach (var d in section5List)
            {
                var section5Row = dtSection5.NewRow();
                section5Row["SEC5_CUSTOMER"] = d.SEC5_CUSTOMER;

                section5Row["SEC5_ADANAARIZA"] = d.SEC5_ADANAARIZA;
                section5Row["SEC5_ADANABAKIM"] = d.SEC5_ADANABAKIM;
                section5Row["SEC5_ADANADIGER"] = d.SEC5_ADANADIGER;
                section5Row["SEC5_ANTALYAARIZA"] = d.SEC5_ANTALYAARIZA;
                section5Row["SEC5_ANTALYABAKIM"] = d.SEC5_ANTALYABAKIM;
                section5Row["SEC5_ANTALYADIGER"] = d.SEC5_ANTALYADIGER;
                section5Row["SEC5_IZMIRARIZA"] = d.SEC5_IZMIRARIZA;
                section5Row["SEC5_IZMIRBAKIM"] = d.SEC5_IZMIRBAKIM;
                section5Row["SEC5_IZMIRDIGER"] = d.SEC5_IZMIRDIGER;
                section5Row["SEC5_ISTANBULARIZA"] = d.SEC5_ISTANBULARIZA;
                section5Row["SEC5_ISTANBULBAKIM"] = d.SEC5_ISTANBULBAKIM;
                section5Row["SEC5_ISTANBULDIGER"] = d.SEC5_ISTANBULDIGER;
                section5Row["SEC5_DIGERARIZA"] = d.SEC5_DIGERARIZA;
                section5Row["SEC5_DIGERBAKIM"] = d.SEC5_DIGERBAKIM;
                section5Row["SEC5_DIGERDIGER"] = d.SEC5_DIGERDIGER;

                dtSection5.Rows.Add(section5Row);
            }

            return dtSection5;
        }
        public DataTable TDRRegionalSection5(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section5List = repositoryTaskDetailReport.ListRegionalSection5(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection5 = new DataTable("REGIONALSECTION5");
            dtSection5.Columns.AddRange(new[]
            {
                new DataColumn("SEC5_CUSTOMER",typeof(string)),

                new DataColumn("SEC5_ARIZA",typeof(int)),
                new DataColumn("SEC5_BAKIM",typeof(int)),
                new DataColumn("SEC5_DIGER",typeof(int)),
            
            });



            foreach (var d in section5List)
            {
                var section5Row = dtSection5.NewRow();
                section5Row["SEC5_CUSTOMER"] = d.SEC5_CUSTOMER;

                section5Row["SEC5_ARIZA"] = d.SEC5_ARIZA;
                section5Row["SEC5_BAKIM"] = d.SEC5_BAKIM;
                section5Row["SEC5_DIGER"] = d.SEC5_DIGER;
              

                dtSection5.Rows.Add(section5Row);
            }

            return dtSection5;
        }

        public DataTable TDRSection6(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section6List = repositoryTaskDetailReport.ListSection6(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection6 = new DataTable("SECTION6");
            dtSection6.Columns.AddRange(new[]
            {
                new DataColumn("SEC6_CUSTOMER",typeof(string)),
                 new DataColumn("SEC6_REGION",typeof(string)),
                new DataColumn("SEC6_BKBEK",typeof(int)),
                new DataColumn("SEC6_IZNGVN",typeof(int)),
                new DataColumn("SEC6_MSIBTM",typeof(int)),
                new DataColumn("SEC6_MUSERT",typeof(int)),
                new DataColumn("SEC6_PRCBEK",typeof(int)),
                new DataColumn("SEC6_TEKLIF",typeof(int)),
                new DataColumn("SEC6_DIGER",typeof(int)),
               

            });



            foreach (var d in section6List)
            {
                var section6Row = dtSection6.NewRow();
                section6Row["SEC6_CUSTOMER"] = d.SEC6_CUSTOMER;
                section6Row["SEC6_REGION"] = d.SEC6_REGION;
                section6Row["SEC6_BKBEK"] = d.SEC6_BKBEK;
                section6Row["SEC6_IZNGVN"] = d.SEC6_IZNGVN;
                section6Row["SEC6_MSIBTM"] = d.SEC6_MSIBTM;
                section6Row["SEC6_MUSERT"] = d.SEC6_MUSERT;
                section6Row["SEC6_PRCBEK"] = d.SEC6_PRCBEK;
                section6Row["SEC6_TEKLIF"] = d.SEC6_TEKLIF;
                section6Row["SEC6_DIGER"] = d.SEC6_DIGER;
               
               

                dtSection6.Rows.Add(section6Row);
            }

            return dtSection6;
        }

        public DataTable TDRSection7(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section7List = repositoryTaskDetailReport.ListSection7(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection7 = new DataTable("SECTION7");
            dtSection7.Columns.AddRange(new[]
            {
                new DataColumn("SEC7_TSKID",typeof(int)),

                new DataColumn("SEC7_TSALINE",typeof(int)),
                new DataColumn("SEC7_TSADESC",typeof(string)),
                new DataColumn("SEC7_STADESC",typeof(string)),
                new DataColumn("SEC7_REGION",typeof(string)),
                new DataColumn("SEC7_HOLDREASON",typeof(string)),
                new DataColumn("SEC7_CATEGORY",typeof(string)),
                new DataColumn("SEC7_TYPE",typeof(string)),
                new DataColumn("SEC7_TASKTYPE",typeof(string)),
                new DataColumn("SEC7_CUSTOMER",typeof(string)),
                new DataColumn("SEC7_BRANCH",typeof(string)),
                new DataColumn("SEC7_TRADE",typeof(string)),
                new DataColumn("SEC7_CREATED",typeof(DateTime)),
                new DataColumn("SEC7_PASSEDDAYS",typeof(string)),
              
            });



            foreach (var d in section7List)
            {
                var section7Row = dtSection7.NewRow();
                section7Row["SEC7_TSKID"] = d.SEC7_TSKID;

                section7Row["SEC7_TSALINE"] = d.SEC7_TSALINE;
                section7Row["SEC7_TSADESC"] = d.SEC7_TSADESC;
                section7Row["SEC7_STADESC"] = d.SEC7_STADESC;
                section7Row["SEC7_REGION"] = d.SEC7_REGION;
                section7Row["SEC7_HOLDREASON"] = d.SEC7_HOLDREASON;
                section7Row["SEC7_CATEGORY"] = d.SEC7_CATEGORY;
                section7Row["SEC7_TYPE"] = d.SEC7_TYPE;
                section7Row["SEC7_TASKTYPE"] = d.SEC7_TASKTYPE;
                section7Row["SEC7_CUSTOMER"] = d.SEC7_CUSTOMER;
                section7Row["SEC7_BRANCH"] = d.SEC7_BRANCH;
                section7Row["SEC7_TRADE"] = d.SEC7_TRADE;
                section7Row["SEC7_CREATED"] = d.SEC7_CREATED;
                section7Row["SEC7_PASSEDDAYS"] = d.SEC7_PASSEDDAYS;
              

                dtSection7.Rows.Add(section7Row);
            }

            return dtSection7;
        }

        public DataTable TDRSection8(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section8List = repositoryTaskDetailReport.ListSection8(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection8 = new DataTable("SECTION8");
            dtSection8.Columns.AddRange(new[]
            {
                new DataColumn("SEC8_USER",typeof(string)),
                new DataColumn("SEC8_TRADE",typeof(string)),
                new DataColumn("SEC8_USERTYPE",typeof(string)),
                new DataColumn("SEC8_ARSUM",typeof(string)),
                new DataColumn("SEC8_BKSUM",typeof(string)),
                new DataColumn("SEC8_DIGERSUM",typeof(string)),
               

            });



            foreach (var d in section8List)
            {
                var section8Row = dtSection8.NewRow();
                section8Row["SEC8_USER"] = d.SEC8_USER;
                section8Row["SEC8_TRADE"] = d.SEC8_TRADE;
                section8Row["SEC8_USERTYPE"] = d.SEC8_USERTYPE;
                section8Row["SEC8_ARSUM"] = d.SEC8_ARSUM;
                section8Row["SEC8_BKSUM"] = d.SEC8_BKSUM;
                section8Row["SEC8_DIGERSUM"] = d.SEC8_DIGERSUM;
              
                dtSection8.Rows.Add(section8Row); 
            }

            return dtSection8;
        }

        public DataTable TDRSection9(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section9List = repositoryTaskDetailReport.ListSection9(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                Type = p.Type,
                TaskType = p.TaskType,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection9 = new DataTable("SECTION9");
            dtSection9.Columns.AddRange(new[]
            {
                new DataColumn("SEC9_CUSTOMER",typeof(string)),
                new DataColumn("SEC9_REGION",typeof(string)),
                new DataColumn("SEC9_TALEP",typeof(int)),
                new DataColumn("SEC9_PLANBEK",typeof(int)),
                new DataColumn("SEC9_PLANAT",typeof(int)),
                new DataColumn("SEC9_BEK",typeof(int)),
                new DataColumn("SEC9_TAM",typeof(int)),
                new DataColumn("SEC9_KAP",typeof(int)),
                new DataColumn("SEC9_DIGER",typeof(int)),
               

            });



            foreach (var d in section9List)
            {
                var section9Row = dtSection9.NewRow();
                section9Row["SEC9_CUSTOMER"] = d.SEC9_CUSTOMER;
                section9Row["SEC9_REGION"] = d.SEC9_REGION;
                section9Row["SEC9_TALEP"] = d.SEC9_TALEP;
                section9Row["SEC9_PLANBEK"] = d.SEC9_PLANBEK;
                section9Row["SEC9_PLANAT"] = d.SEC9_PLANAT;
                section9Row["SEC9_BEK"] = d.SEC9_BEK;
                section9Row["SEC9_TAM"] = d.SEC9_TAM;
                section9Row["SEC9_KAP"] = d.SEC9_KAP;
                section9Row["SEC9_DIGER"] = d.SEC9_DIGER;
             
                


                dtSection9.Rows.Add(section9Row);
            }

            return dtSection9;
        }

        public DataTable TDRSection10(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section4List = repositoryTaskDetailReport.ListSection10(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection4 = new DataTable("SECTION10");
            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("SEC10_TASKTYPE",typeof(string)),

                new DataColumn("SEC10_ADANAACIK",typeof(int)),
                new DataColumn("SEC10_ADANATAMAM",typeof(int)),
                new DataColumn("SEC10_ADANAIPTAL",typeof(int)),
                new DataColumn("SEC10_ANTALYAACIK",typeof(int)),
                new DataColumn("SEC10_ANTALYATAMAM",typeof(int)),
                new DataColumn("SEC10_ANTALYAIPTAL",typeof(int)),
                new DataColumn("SEC10_IZMIRACIK",typeof(int)),
                new DataColumn("SEC10_IZMIRTAMAM",typeof(int)),
                new DataColumn("SEC10_IZMIRIPTAL",typeof(int)),
                new DataColumn("SEC10_ISTANBULACIK",typeof(int)),
                new DataColumn("SEC10_ISTANBULTAMAM",typeof(int)),
                new DataColumn("SEC10_ISTANBULIPTAL",typeof(int)),
                new DataColumn("SEC10_DIGERACIK",typeof(int)),
                new DataColumn("SEC10_DIGERTAMAM",typeof(int)),
                new DataColumn("SEC10_DIGERIPTAL",typeof(int)),
            });



            foreach (var d in section4List)
            {
                var section4Row = dtSection4.NewRow();
                section4Row["SEC10_TASKTYPE"] = d.SEC10_TASKTYPE;

                section4Row["SEC10_ADANAACIK"] = d.SEC10_ADANAACIK;
                section4Row["SEC10_ADANATAMAM"] = d.SEC10_ADANATAMAM;
                section4Row["SEC10_ADANAIPTAL"] = d.SEC10_ADANAIPTAL;
                section4Row["SEC10_ANTALYAACIK"] = d.SEC10_ANTALYAACIK;
                section4Row["SEC10_ANTALYATAMAM"] = d.SEC10_ANTALYATAMAM;
                section4Row["SEC10_ANTALYAIPTAL"] = d.SEC10_ANTALYAIPTAL;
                section4Row["SEC10_IZMIRACIK"] = d.SEC10_IZMIRACIK;
                section4Row["SEC10_IZMIRTAMAM"] = d.SEC10_IZMIRTAMAM;
                section4Row["SEC10_IZMIRIPTAL"] = d.SEC10_IZMIRIPTAL;
                section4Row["SEC10_ISTANBULACIK"] = d.SEC10_ISTANBULACIK;
                section4Row["SEC10_ISTANBULTAMAM"] = d.SEC10_ISTANBULTAMAM;
                section4Row["SEC10_ISTANBULIPTAL"] = d.SEC10_ISTANBULIPTAL;
                section4Row["SEC10_DIGERACIK"] = d.SEC10_DIGERACIK;
                section4Row["SEC10_DIGERTAMAM"] = d.SEC10_DIGERTAMAM;
                section4Row["SEC10_DIGERIPTAL"] = d.SEC10_DIGERIPTAL;

                dtSection4.Rows.Add(section4Row);
            }

            return dtSection4;
        }
        public DataTable TDRRegionalSection10(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section4List = repositoryTaskDetailReport.ListRegionalSection10(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection4 = new DataTable("REGIONALSECTION10");
            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("SEC10_TASKTYPE",typeof(string)),

                new DataColumn("SEC10_ACIK",typeof(int)),
                new DataColumn("SEC10_TAMAM",typeof(int)),
                new DataColumn("SEC10_IPTAL",typeof(int)),
              
            });



            foreach (var d in section4List)
            {
                var section4Row = dtSection4.NewRow();
                section4Row["SEC10_TASKTYPE"] = d.SEC10_TASKTYPE;

                section4Row["SEC10_ACIK"] = d.SEC10_ACIK;
                section4Row["SEC10_TAMAM"] = d.SEC10_TAMAM;
                section4Row["SEC10_IPTAL"] = d.SEC10_IPTAL;
              

                dtSection4.Rows.Add(section4Row);
            }

            return dtSection4;
        }

        public DataTable TDRSection11(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section4List = repositoryTaskDetailReport.ListSection11(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection4 = new DataTable("SECTION11");
            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("SEC11_CANCELREASON",typeof(string)),

                new DataColumn("SEC11_ADANA",typeof(int)),
                new DataColumn("SEC11_ANTALYA",typeof(int)),
                new DataColumn("SEC11_IZMIR",typeof(int)),
                 new DataColumn("SEC11_ISTANBUL",typeof(int)),
                  new DataColumn("SEC11_TR",typeof(int)),
                new DataColumn("SEC11_DIGER",typeof(int)),
                
            });



            foreach (var d in section4List)
            {
                var section4Row = dtSection4.NewRow();
                section4Row["SEC11_CANCELREASON"] = d.SEC11_CANCELREASON;

                section4Row["SEC11_ADANA"] = d.SEC11_ADANA;
                section4Row["SEC11_ANTALYA"] = d.SEC11_ANTALYA;
                section4Row["SEC11_IZMIR"] = d.SEC11_IZMIR;
                section4Row["SEC11_ISTANBUL"] = d.SEC11_ISTANBUL;
                section4Row["SEC11_TR"] = d.SEC11_TR;
                section4Row["SEC11_DIGER"] = d.SEC11_DIGER;

                dtSection4.Rows.Add(section4Row);
            }

            return dtSection4;
        }
        public DataTable TDRRegionalSection11(TDRParameters p)
        {
            RepositoryTaskDetailReport repositoryTaskDetailReport = new RepositoryTaskDetailReport();
            var section4List = repositoryTaskDetailReport.ListRegionalSection11(new TaskDetailParameters()
            {
                Organization = p.Organization,
                Department = p.Department,
                PassedDaysLimit = p.PassedDaysLimit,
                Branch = p.Branch,
                Customer = p.Customer,
                Category = p.Category,
                TaskCompletedEnd = p.TaskCompletedEnd,
                TaskCompletedStart = p.TaskCompletedStart,
                TaskCreatedEnd = p.TaskCreatedEnd,
                TaskCreatedStart = p.TaskCreatedStart,
                CustomerGroup = p.CustomerGroup,
                Province = p.Province,
                Region = p.Region,
                Status = p.Status,
                Supplier = p.Supplier,
            });
            var dtSection4 = new DataTable("REGIONALSECTION11");
            dtSection4.Columns.AddRange(new[]
            {
                new DataColumn("SEC11_CANCELREASON",typeof(string)),

                new DataColumn("SEC11_COUNT",typeof(int)),
              

            });



            foreach (var d in section4List)
            {
                var section4Row = dtSection4.NewRow();
                section4Row["SEC11_CANCELREASON"] = d.SEC11_CANCELREASON;

                section4Row["SEC11_COUNT"] = d.SEC11_COUNT;
                

                dtSection4.Rows.Add(section4Row);
            }

            return dtSection4;
        }


    }
}