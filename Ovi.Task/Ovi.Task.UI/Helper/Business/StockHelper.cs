using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper.Business
{
    public class StockEntry
    {
        public string Trxtype { get; set; }
        public string Warehouse { get; set; }
        public string Bin { get; set; }
        public long Part { get; set; }

    }
    public class StockHelper
    {

        RepositoryStock repositoryStock;

        public StockHelper()
        {
            repositoryStock = new RepositoryStock();

        }


        public decimal? GetAvgPrice(StockEntry se)
        {
            if (se.Trxtype == "I")
            {
                GridRequest gridRequest = new GridRequest()
                {
                    filter = new GridFilters()
                    {
                        Filters = new List<GridFilter>()
                    {
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = se.Warehouse,
                            Operator = "eq",
                            Field = "STK_WAREHOUSE"
                        },
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = se.Part,
                            Operator = "eq",
                            Field = "STK_PART"
                        }
                    }
                    }
                };
                var stocklist = repositoryStock.List(gridRequest);
                if (stocklist!= null && stocklist.Count > 0 )
                {
                    return stocklist[0].STK_AVGPRICE;
                }

            }
            else if (se.Trxtype == "RT")
            {
                GridRequest gridRequest = new GridRequest()
                {
                    filter = new GridFilters()
                    {
                        Filters = new List<GridFilter>()
                        {
                            new GridFilter()
                            {
                                Logic = "and",
                                Value = se.Warehouse,
                                Operator = "eq",
                                Field = "STK_WAREHOUSE"
                            },
                            new GridFilter()
                            {
                                Logic = "and",
                                Value = se.Bin,
                                Operator = "eq",
                                Field = "STK_BIN"
                            },
                            new GridFilter()
                            {
                                Logic = "and",
                                Value = se.Part,
                                Operator = "eq",
                                Field = "STK_PART"
                            }
                        }
                    }
                };
                var stocklist = repositoryStock.List(gridRequest);
                if (stocklist != null && stocklist.Count > 0)
                {
                    return stocklist[0].STK_AVGPRICE;
                }
            }

            return null;
        }
    }
}