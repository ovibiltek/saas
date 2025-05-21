using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Controllers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.UI.Helper.Reports
{
    public class SRP2
    {


        private IList<TMCATEGORIES> categories;


        public SRP2()
        {
            var gr = new GridRequest
            {
                loadall = true,
                groupedFilters = new List<GridFilters>(),
                filter = new GridFilters { Filters = new List<GridFilter>(), Logic = "and" }
            };


            gr.filter.Filters.Add(new GridFilter
            {
                Field = "CAT_CODE",
                Value = "*",
                Operator = "neq",

            });

            gr.filter.Filters.Add(new GridFilter
            {
                Field = "CAT_CODE",
                Value = new JArray(new[]{"YGS",
                    "YE",
                    "PROJELI-ISLER",
                    "SA","MS.CO"
                }),
                Operator = "nin",

            });

            var repositoryCategories = new RepositoryCategories();
            categories = repositoryCategories.List(gr);

        }


        public DataTable GetActivities(SRP2Parameters p)
        {
            var dtActivities = new DataTable("Data");

            var gr = new GridRequest
            {
                loadall = true,
                groupedFilters = new List<GridFilters>(),
                filter = new GridFilters { Filters = new List<GridFilter>(), Logic = "and" }
            };

            if (p.TaskCompletedStart.HasValue && p.TaskCompletedEnd.HasValue)
            {
                gr.filter.Filters.Add(new GridFilter
                {
                    Field = "SRP_TSKCOMPLETED",
                    Operator = "between",
                    Value = p.TaskCompletedStart.Value.Date,
                    Value2 = p.TaskCompletedEnd.Value.Date.AddHours(23).AddMinutes(59).AddSeconds(59)
                });
            }
            else if (p.TaskCompletedStart.HasValue)
            {
                gr.filter.Filters.Add(new GridFilter
                {
                    Field = "SRP_TSKCOMPLETED",
                    Operator = "gte",
                    Value = p.TaskCompletedStart.Value.Date,
                });
            }
            else if (p.TaskCompletedEnd.HasValue)
            {
                gr.filter.Filters.Add(new GridFilter
                {
                    Field = "SRP_TSKCOMPLETED",
                    Operator = "lte",
                    Value = p.TaskCompletedEnd.Value.Date
                });
            }

            gr.filter.Filters.Add(new GridFilter { Field = "SRP_TSKPSPCODE", Operator = "isnotnull" });
            gr.filter.Filters.Add(new GridFilter { Field = "SRP_TSKORGANIZATION", Operator = "eq", Value = "GUNDEMIR" });

            var repositoryServiceReportLines = new RepositoryServiceReportLines();
            var repositoryDepartmants = new RepositoryDepartments();
            var ticariDep = repositoryDepartmants.Get("TICARI.BINA.ENDUSTRIYEL.TESISLER");
            var ticariUsers = ticariDep.DEP_AUTHORIZED.Split(',');
            var result = repositoryServiceReportLines.List(gr);
            var lines = result.Where(x => x.SRP_TSKCUSTOMER != "BSH").ToList();

            #region SatışveMüşteriYönetimi
            var satisveMüsteriYönetimi = lines.Where(x => !ticariUsers.Contains(x.SRP_TSKCUSTOMERPMCODE)).ToList();
            #region COileYapilanIsler
            var COileYapilanIsler = satisveMüsteriYönetimi.Where(x => x.SRP_TRADEISSUPP == "+").ToList();
            #region Bakim
            var COBakim = COileYapilanIsler.Where(x => categories.Where(c=>c.CAT_GROUP == "BAKIM")
                                                        .Select(c=>c.CAT_CODE)
                                                        .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? COBakimProfit = 0;
            decimal? COBakimcost = 0;
            decimal? COBakimPsp = 0;
            int? COBakimPercentage = 0;

            foreach (var item in COBakim)
            {
                COBakimProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                COBakimcost += item.SRP_TOTALCOST;
                COBakimPsp += item.SRP_TOTALPSP;
            }
            COBakimPercentage = (int?)(COBakimcost == 0 ? 0 : (COBakimProfit / COBakimcost) * 100);
            var COBakimCount = COBakim.Count;
            #endregion
            #region Ariza 
            var COAriza = COileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "ARIZA")
                                                    .Select(c => c.CAT_CODE)
                                                    .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? COArizaProfit = 0;
            decimal? COArizacost = 0;
            decimal? COArizaPsp = 0;
            int? COArizaPercentage = 0;
            foreach (var item in COAriza)
            {
                COArizaProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                COArizacost += item.SRP_TOTALCOST;
                COArizaPsp += item.SRP_TOTALPSP;
            }
            COArizaPercentage = (int?)(COArizacost == 0 ? 0 : (COArizaProfit / COArizacost) * 100);
            var COArizaCount = COAriza.Count;
            #endregion
            #region diger
            var CODiger = COileYapilanIsler.Where(x => categories.Where(c => !new[] {"ARIZA","BAKIM"}.Contains(c.CAT_GROUP))
                                                                .Select(c => c.CAT_CODE)
                                                                .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? CODigerProfit = 0;
            decimal? CODigercost = 0;
            decimal? CODigerPsp = 0;
            int? CODigerPercentage = 0;

            foreach (var item in CODiger)
            {
                CODigerProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                CODigercost += item.SRP_TOTALCOST;
                CODigerPsp += item.SRP_TOTALPSP;
            }
            CODigerPercentage = (int?)(CODigercost == 0 ? 0 : (CODigerProfit / CODigercost) * 100);
            var CODigerCount = CODiger.Count;
            #endregion
            #endregion
            #region MobilIleYapilanIsler
            var MobilileYapilanIsler = satisveMüsteriYönetimi.Where(x => x.SRP_TRADEISSUPP == "-").ToList();
            #region MobilBakim
            var MBakim = MobilileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "BAKIM")
                                                        .Select(c => c.CAT_CODE)
                                                        .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? MBakimProfit = 0;
            decimal? MBakimcost = 0;
            decimal? MBakimPsp = 0;
            int? MBakimPercentage = 0;

            foreach (var item in MBakim)
            {
                MBakimProfit += item.SRP_TOTALPSP - (p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST);
                MBakimcost += p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST;
                MBakimPsp += item.SRP_TOTALPSP;
            }
            MBakimPercentage = (int?)(MBakimcost == 0 ? 0 : (MBakimProfit / MBakimcost) * 100);
            var MBakimCount = MBakim.Count;
            #endregion
            #region MobilAriza 
            var MAriza = MobilileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "ARIZA")
                                                        .Select(c => c.CAT_CODE)
                                                        .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? MArizaProfit = 0;
            decimal? MArizacost = 0;
            decimal? MArizaPsp = 0;
            int? MArizaPercentage = 0;

            foreach (var item in MAriza)
            {
                MArizaProfit += item.SRP_TOTALPSP - (p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST);
                MArizacost += p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST;
                MArizaPsp += item.SRP_TOTALPSP;
            }
            MArizaPercentage = (int?)(MArizacost == 0 ? 0 : (MArizaProfit / MArizacost) * 100);
            var MArizaCount = MAriza.Count;
            #endregion
            #region MobilDiger
            var MDiger = MobilileYapilanIsler.Where(x => categories.Where(c => !new[] { "ARIZA", "BAKIM" }.Contains(c.CAT_GROUP))
                                                                            .Select(c => c.CAT_CODE)
                                                                            .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? MDigerProfit = 0;
            decimal? MDigercost = 0;
            decimal? MDigerPsp = 0;
            int? MDigerPercentage = 0;

            foreach (var item in MDiger)
            {
                MDigerProfit += item.SRP_TOTALPSP - (p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST);
                MDigercost += p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST;
                MDigerPsp += item.SRP_TOTALPSP;
            }
            MDigerPercentage = (int?)(MDigercost == 0 ? 0 : (MDigerProfit / MDigercost) * 100);
            var MDigerCount = MDiger.Count;
            #endregion
            #endregion
            #endregion
            #region TicariBinaveEndüstriyelTesisler
            var ticariBinaveEndustriyelTesisler = lines.Where(x => ticariUsers.Contains(x.SRP_TSKCUSTOMERPMCODE)).ToList();
            #region COileYapilanIsler
            var TCOileYapilanIsler = ticariBinaveEndustriyelTesisler.Where(x => x.SRP_TRADEISSUPP == "+").ToList();
            #region Bakim
            var TCOBakim = TCOileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "BAKIM")
                                                            .Select(c => c.CAT_CODE)
                                                            .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? TCOBakimProfit = 0;
            decimal? TCOBakimcost = 0;
            decimal? TCOBakimPsp = 0;
            int? TCOBakimPercentage = 0;

            foreach (var item in TCOBakim)
            {
                TCOBakimProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                TCOBakimcost += item.SRP_TOTALCOST;
                TCOBakimPsp += item.SRP_TOTALPSP;
            }
            TCOBakimPercentage = (int?)(TCOBakimcost == 0 ? 0 : (TCOBakimProfit / TCOBakimcost) * 100);
            var TCOBakimCount = TCOBakim.Count;
            #endregion
            #region Ariza 
            var TCOAriza = TCOileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "ARIZA")
                                                         .Select(c => c.CAT_CODE)
                                                         .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? TCOArizaProfit = 0;
            decimal? TCOArizacost = 0;
            decimal? TCOArizaPsp = 0;
            int? TCOArizaPercentage = 0;
            foreach (var item in TCOAriza)
            {
                TCOArizaProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                TCOArizacost += item.SRP_TOTALCOST;
                TCOArizaPsp += item.SRP_TOTALPSP;
            }
            TCOArizaPercentage = (int?)(TCOArizacost == 0 ? 0 : (TCOArizaProfit / TCOArizacost) * 100);
            var TCOArizaCount = TCOAriza.Count;
            #endregion
            #region diger
            var TCODiger = TCOileYapilanIsler.Where(x => categories.Where(c => !new[] { "ARIZA", "BAKIM" }
                                                        .Contains(c.CAT_GROUP)).Select(c => c.CAT_CODE).Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? TCODigerProfit = 0;
            decimal? TCODigercost = 0;
            decimal? TCODigerPsp = 0;
            int? TCODigerPercentage = 0;

            foreach (var item in TCODiger)
            {
                TCODigerProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                TCODigercost += item.SRP_TOTALCOST;
                TCODigerPsp += item.SRP_TOTALPSP;
            }
            TCODigerPercentage = (int?)(TCODigercost == 0 ? 0 : (TCODigerProfit / TCODigercost) * 100);
            var TCODigerCount = TCODiger.Count;
            #endregion
            #endregion
            #region MobilIleYapilanIsler
            var TMobilileYapilanIsler = ticariBinaveEndustriyelTesisler.Where(x => x.SRP_TRADEISSUPP == "-").ToList();
            #region MobilBakim
            var TMBakim = TMobilileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "BAKIM")
                                                            .Select(c => c.CAT_CODE)
                                                            .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? TMBakimProfit = 0;
            decimal? TMBakimcost = 0;
            decimal? TMBakimPsp = 0;
            int? TMBakimPercentage = 0;

            foreach (var item in TMBakim)
            {
                TMBakimProfit += item.SRP_TOTALPSP - (p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST);
                TMBakimcost += p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST;
                TMBakimPsp += item.SRP_TOTALPSP;
            }
            TMBakimPercentage = (int?)(TMBakimcost == 0 ? 0 : (TMBakimProfit / TMBakimcost) * 100);
            var TMBakimCount = TMBakim.Count;
            #endregion
            #region MobilAriza 
            var TMAriza = TMobilileYapilanIsler.Where(x => categories.Where(c => c.CAT_GROUP == "ARIZA")
                                                            .Select(c => c.CAT_CODE)
                                                            .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? TMArizaProfit = 0;
            decimal? TMArizacost = 0;
            decimal? TMArizaPsp = 0;
            int? TMArizaPercentage = 0;

            foreach (var item in TMAriza)
            {
                TMArizaProfit += item.SRP_TOTALPSP - (p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST);
                TMArizacost += p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST;
                TMArizaPsp += item.SRP_TOTALPSP;
            }
            TMArizaPercentage = (int?)(TMArizacost == 0 ? 0 : (TMArizaProfit / TMArizacost) * 100);
            var TMArizaCount = TMAriza.Count;
            #endregion
            #region MobilDiger
            var TMDiger = TMobilileYapilanIsler.Where(x => categories.Where(c => !new[] { "ARIZA", "BAKIM" }.Contains(c.CAT_GROUP))
                                                                     .Select(c => c.CAT_CODE)
                                                                     .Contains(x.SRP_TSKCATEGORY)).ToList();
            decimal? TMDigerProfit = 0;
            decimal? TMDigercost = 0;
            decimal? TMDigerPsp = 0;
            int? TMDigerPercentage = 0;

            foreach (var item in TMDiger)
            {
                TMDigerProfit += item.SRP_TOTALPSP - (p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST);
                TMDigercost += p.ZeroLaborCost == '+' ? item.SRP_TOTALCOST - item.SRP_LABORCOST : item.SRP_TOTALCOST;
                TMDigerPsp += item.SRP_TOTALPSP;
            }
            TMDigerPercentage = (int?)(TMDigercost == 0 ? 0 : (TMDigerProfit / TMDigercost) * 100);
            var TMDigerCount = TMDiger.Count;
            #endregion
            #endregion
            #endregion
            #region YGIS
            var ygisLines = lines.Where(x => x.SRP_TSKCATEGORY == "YGS").ToList();
            decimal? ygisProfit = 0;
            decimal? ygiscost = 0;
            decimal? ygisPsp = 0;
            int? ygisPercentage = 0;

            foreach (var item in ygisLines)
            {
                ygisProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                ygiscost += item.SRP_TOTALCOST;
                ygisPsp += item.SRP_TOTALPSP;
            }
            ygisPercentage = (int?)(ygiscost == 0 ? 0 : (ygisProfit / ygiscost) * 100);
            var ygisCount = ygisLines.Count;
            #endregion
            #region TeknikIsletmeler
            var yeLines = lines.Where(x => x.SRP_TSKCATEGORY == "YE").ToList();
            decimal? yeProfit = 0;
            decimal? yecost = 0;
            decimal? yePsp = 0;
            int? yePercentage = 0;

            foreach (var item in yeLines)
            {
                yeProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                yecost += item.SRP_TOTALCOST;
                yePsp += item.SRP_TOTALPSP;

            }
            yePercentage = (int?)(yecost == 0 ? 0 : (yeProfit / yecost) * 100);
            var yeCount = yeLines.Count;
            #endregion
            #region ProjeliIsler
            var piLines = lines.Where(x => x.SRP_TSKCATEGORY == "PROJELI-ISLER").ToList();
            decimal? piProfit = 0;
            decimal? picost = 0;
            decimal? piPsp = 0;
            int? piPercentage = 0;

            foreach (var item in piLines)
            {
                piProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                picost += item.SRP_TOTALCOST;
                piPsp += item.SRP_TOTALPSP;

            }
            piPercentage = (int?)(picost == 0 ? 0 : (piProfit / picost) * 100);
            var piCount = piLines.Count;
            #endregion
            #region malSatisi
            var msLines = lines.Where(x => x.SRP_TSKCATEGORY == "SA" || x.SRP_TSKCATEGORY == "MS.CO").ToList();
            decimal? msProfit = 0;
            decimal? mscost = 0;
            decimal? msPsp = 0;
            int? msPercentage = 0;

            foreach (var item in msLines)
            {
                msProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                mscost += item.SRP_TOTALCOST;
                msPsp += item.SRP_TOTALPSP;

            }
            msPercentage = (int?)(mscost == 0 ? 0 : (msProfit / mscost) * 100);
            var msCount = msLines.Count;
            #endregion
            #region bsh
            var bshLines = result.Where(x => x.SRP_TSKCUSTOMER == "BSH").ToList();
            decimal? bshProfit = 0;
            decimal? bshcost = 0;
            decimal? bshPsp = 0;
            int? bshPercentage = 0;

            foreach (var item in bshLines)
            {
                bshProfit += item.SRP_TOTALPSP - item.SRP_TOTALCOST;
                bshcost += item.SRP_TOTALCOST;
                bshPsp += item.SRP_TOTALPSP;

            }
            bshPercentage = (int?)(bshcost == 0 ? 0 : (bshProfit / bshcost) * 100);
            var bshCount = bshLines.Count;
            #endregion

            dtActivities.Columns.AddRange(new[]
            {
                new DataColumn("tmobakimprofit", typeof(decimal)),
                new DataColumn("tmobakimcost", typeof(decimal)),
                new DataColumn("tmobakimpsp", typeof(decimal)),
                new DataColumn("tmobakimperc", typeof(int)),
                new DataColumn("tmobakimcount", typeof(int)),
                new DataColumn("tmoarizaprofit", typeof(decimal)),
                new DataColumn("tmoarizacost", typeof(decimal)),
                new DataColumn("tmoarizapsp", typeof(decimal)),
                new DataColumn("tmoarizaperc", typeof(int)),
                new DataColumn("tmoarizacount", typeof(int)),
                new DataColumn("tmodigerprofit", typeof(decimal)),
                new DataColumn("tmodigercost", typeof(decimal)),
                new DataColumn("tmodigerpsp", typeof(decimal)),
                new DataColumn("tmodigerperc", typeof(int)),
                new DataColumn("tmodigercount", typeof(int)),
                new DataColumn("tcobakimprofit", typeof(decimal)),
                new DataColumn("tcobakimcost", typeof(decimal)),
                new DataColumn("tcobakimpsp", typeof(decimal)),
                new DataColumn("tcobakimperc", typeof(int)),
                new DataColumn("tcobakimcount", typeof(int)),
                new DataColumn("tcoarizaprofit", typeof(decimal)),
                new DataColumn("tcoarizacost", typeof(decimal)),
                new DataColumn("tcoarizapsp", typeof(decimal)),
                new DataColumn("tcoarizaperc", typeof(int)),
                new DataColumn("tcoarizacount", typeof(int)),
                new DataColumn("tcodigerprofit", typeof(decimal)),
                new DataColumn("tcodigercost", typeof(decimal)),
                new DataColumn("tcodigerpsp", typeof(decimal)),
                new DataColumn("tcodigerperc", typeof(int)),
                new DataColumn("tcodigercount", typeof(int)),
                new DataColumn("mobakimprofit", typeof(decimal)),
                new DataColumn("mobakimcost", typeof(decimal)),
                new DataColumn("mobakimpsp", typeof(decimal)),
                new DataColumn("mobakimperc", typeof(int)),
                new DataColumn("mobakimcount", typeof(int)),
                new DataColumn("moarizaprofit", typeof(decimal)),
                new DataColumn("moarizacost", typeof(decimal)),
                new DataColumn("moarizapsp", typeof(decimal)),
                new DataColumn("moarizaperc", typeof(int)),
                new DataColumn("moarizacount", typeof(int)),
                new DataColumn("modigerprofit", typeof(decimal)),
                new DataColumn("modigercost", typeof(decimal)),
                new DataColumn("modigerpsp", typeof(decimal)),
                new DataColumn("modigerperc", typeof(int)),
                new DataColumn("modigercount", typeof(int)),
                new DataColumn("cobakimprofit", typeof(decimal)),
                new DataColumn("cobakimcost", typeof(decimal)),
                new DataColumn("cobakimpsp", typeof(decimal)),
                new DataColumn("cobakimperc", typeof(int)),
                new DataColumn("cobakimcount", typeof(int)),
                new DataColumn("coarizaprofit", typeof(decimal)),
                new DataColumn("coarizacost", typeof(decimal)),
                new DataColumn("coarizapsp", typeof(decimal)),
                new DataColumn("coarizaperc", typeof(int)),
                new DataColumn("coarizacount", typeof(int)),
                new DataColumn("ygisprofit", typeof(decimal)),
                new DataColumn("ygiscost", typeof(decimal)),
                new DataColumn("ygispsp", typeof(decimal)),
                new DataColumn("ygisperc", typeof(int)),
                new DataColumn("ygiscount", typeof(int)),
                new DataColumn("yeprofit", typeof(decimal)),
                new DataColumn("yecost", typeof(decimal)),
                new DataColumn("yepsp", typeof(decimal)),
                new DataColumn("yeperc", typeof(int)),
                new DataColumn("yecount", typeof(int)),
                new DataColumn("msprofit", typeof(decimal)),
                new DataColumn("mscost", typeof(decimal)),
                new DataColumn("mspsp", typeof(decimal)),
                new DataColumn("msperc", typeof(int)),
                new DataColumn("mscount", typeof(int)),
                new DataColumn("bshprofit", typeof(decimal)),
                new DataColumn("bshcost", typeof(decimal)),
                new DataColumn("bshpsp", typeof(decimal)),
                new DataColumn("bshperc", typeof(int)),
                new DataColumn("bshcount", typeof(int)),
                new DataColumn("piprofit", typeof(decimal)),
                new DataColumn("picost", typeof(decimal)),
                new DataColumn("pipsp", typeof(decimal)),
                new DataColumn("piperc", typeof(int)),
                new DataColumn("picount", typeof(int)),
                new DataColumn("codigerprofit", typeof(decimal)),
                new DataColumn("codigercost", typeof(decimal)),
                new DataColumn("codigerpsp", typeof(decimal)),
                new DataColumn("codigerperc", typeof(int)),
                new DataColumn("codigercount", typeof(int))
            });
            
            #region fillData
            var actRow = dtActivities.NewRow();
            actRow["tmobakimprofit"] = TMBakimProfit;
            actRow["tmobakimcost"] = TMBakimcost;
            actRow["tmobakimpsp"] = TMBakimPsp;
            actRow["tmobakimperc"] = TMBakimPercentage;
            actRow["tmobakimcount"] = TMBakimCount;

            actRow["tmoarizaprofit"] = TMArizaProfit;
            actRow["tmoarizacost"] = TMArizacost;
            actRow["tmoarizapsp"] = TMArizaPsp;
            actRow["tmoarizaperc"] = TMArizaPercentage;
            actRow["tmoarizacount"] = TMArizaCount;

            actRow["tmodigerprofit"] = TMDigerProfit;
            actRow["tmodigercost"] = TMDigercost;
            actRow["tmodigerpsp"] = TMDigerPsp;
            actRow["tmodigerperc"] = TMDigerPercentage;
            actRow["tmodigercount"] = TMDigerCount;

            actRow["tcobakimprofit"] = TCOBakimProfit;
            actRow["tcobakimcost"] = TCOBakimcost;
            actRow["tcobakimpsp"] = TCOBakimPsp;
            actRow["tcobakimperc"] = TCOBakimPercentage;
            actRow["tcobakimcount"] = TCOBakimCount;

            actRow["tcoarizaprofit"] = TCOArizaProfit;
            actRow["tcoarizacost"] = TCOArizacost;
            actRow["tcoarizapsp"] = TCOArizaPsp;
            actRow["tcoarizaperc"] = TCOArizaPercentage;
            actRow["tcoarizacount"] = TCOArizaCount;

            actRow["tcodigerprofit"] = TCODigerProfit;
            actRow["tcodigercost"] = TCODigercost;
            actRow["tcodigerpsp"] = TCODigerPsp;
            actRow["tcodigerperc"] = TCODigerPercentage;
            actRow["tcodigercount"] = TCODigerCount;

            actRow["mobakimprofit"] = MBakimProfit;
            actRow["mobakimcost"] = MBakimcost;
            actRow["mobakimpsp"] = MBakimPsp;
            actRow["mobakimperc"] = MBakimPercentage;
            actRow["mobakimcount"] = MBakimCount;

            actRow["moarizaprofit"] = MArizaProfit;
            actRow["moarizacost"] = MArizacost;
            actRow["moarizapsp"] = MArizaPsp;
            actRow["moarizaperc"] = MArizaPercentage;
            actRow["moarizacount"] = MArizaCount;

            actRow["modigerprofit"] = MDigerProfit;
            actRow["modigercost"] = MDigercost;
            actRow["modigerpsp"] = MDigerPsp;
            actRow["modigerperc"] = MDigerPercentage;
            actRow["modigercount"] = MDigerCount;

            actRow["cobakimprofit"] = COBakimProfit;
            actRow["cobakimcost"] = COBakimcost;
            actRow["cobakimpsp"] = COBakimPsp;
            actRow["cobakimperc"] = COBakimPercentage;
            actRow["cobakimcount"] = COBakimCount;

            actRow["coarizaprofit"] = COArizaProfit;
            actRow["coarizacost"] = COArizacost;
            actRow["coarizapsp"] = COArizaPsp;
            actRow["coarizaperc"] = COArizaPercentage;
            actRow["coarizacount"] = COArizaCount;

            actRow["codigerprofit"] = CODigerProfit;
            actRow["codigercost"] = CODigercost;
            actRow["codigerpsp"] = CODigerPsp;
            actRow["codigerperc"] = CODigerPercentage;
            actRow["codigercount"] = CODigerCount;

            actRow["ygisprofit"] = ygisProfit;
            actRow["ygiscost"] = ygiscost;
            actRow["ygispsp"] = ygisPsp;
            actRow["ygisperc"] = ygisPercentage;
            actRow["ygiscount"] = ygisCount;

            actRow["yeprofit"] = yeProfit;
            actRow["yecost"] = yecost;
            actRow["yepsp"] = yePsp;
            actRow["yeperc"] = yePercentage;
            actRow["yecount"] = yeCount;

            actRow["msprofit"] = msProfit;
            actRow["mscost"] = mscost;
            actRow["mspsp"] = msPsp;
            actRow["msperc"] = msPercentage;
            actRow["mscount"] = msCount;

            actRow["bshprofit"] = bshProfit;
            actRow["bshcost"] = bshcost;
            actRow["bshpsp"] = bshPsp;
            actRow["bshperc"] = bshPercentage;
            actRow["bshcount"] = bshCount;

            actRow["piprofit"] = piProfit;
            actRow["picost"] = picost;
            actRow["pipsp"] = piPsp;
            actRow["piperc"] = piPercentage;
            actRow["picount"] = piCount;
            dtActivities.Rows.Add(actRow);
            #endregion

            return dtActivities;

        }

        public DataTable GetNotes()
        {
            var dtnotes = new DataTable("Notes");


            #region getCategories

            var bakimKategorileriTanimi = categories.Where(x => categories.Where(c => c.CAT_GROUP == "BAKIM")
                                                                .Select(c=>c.CAT_CODE).Contains(x.CAT_CODE)).Select(x => x.CAT_DESC).ToList();
            var arizaKategorileriTanimi = categories.Where(x => categories.Where(c => c.CAT_GROUP == "ARIZA")
                                                                .Select(c => c.CAT_CODE).Contains(x.CAT_CODE)).Select(x => x.CAT_DESC).ToList();
            var digerKategorileriTanimi = categories.Where(x => categories.Where(c => !new[] { "ARIZA", "BAKIM" }.Contains(c.CAT_GROUP))
                                                                .Select(c => c.CAT_CODE)
                                                                .Contains(x.CAT_CODE)).Select(x => x.CAT_DESC).ToList();
            #endregion


            dtnotes.Columns.AddRange(new[]
            {
                new DataColumn("BakimKategorileri"),
                new DataColumn("ArizaKategorileri"),
                new DataColumn("DigerKategoriler")
            });
            
            var noteRow = dtnotes.NewRow();


            noteRow["BakimKategorileri"] = categories.Any(c => c.CAT_GROUP == "BAKIM") ? categories.Where(c => c.CAT_GROUP == "BAKIM") 
                                          .Select(c => c.CAT_DESC).Aggregate((a, b) => a + ", " + b) : null;
            noteRow["ArizaKategorileri"] = categories.Any(c => c.CAT_GROUP == "ARIZA")
                ? categories.Where(c => c.CAT_GROUP == "ARIZA")
                    .Select(c => c.CAT_DESC).Aggregate((a, b) => a + ", " + b)
                : null;
            noteRow["DigerKategoriler"] = categories.Any(c => !new[] { "ARIZA", "BAKIM" }.Contains(c.CAT_GROUP))
                ? categories.Where(c => !new[] { "ARIZA", "BAKIM" }.Contains(c.CAT_GROUP))
                    .Select(c => c.CAT_DESC).Aggregate((a, b) => a + ", " + b)
                : null;
            
            dtnotes.Rows.Add(noteRow);

            return dtnotes;

        }
    }
}