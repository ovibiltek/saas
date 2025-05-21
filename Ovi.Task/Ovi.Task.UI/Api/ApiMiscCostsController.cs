using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class ApiMiscCostsController : ApiController
    {
        private RepositoryMiscCosts repositoryMiscCosts;
        private RepositoryContractPartPrices repositoryContractPartPrices;

        public ApiMiscCostsController()
        {
            repositoryMiscCosts = new RepositoryMiscCosts();
            repositoryContractPartPrices = new RepositoryContractPartPrices();
        }

        private void HideFieldsFromSupplier(TMMISCCOSTS mc)
        {
            mc.MSC_UNITSALESPRICE = null;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                int total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMMISCCOSTS>.Count(gridRequest);
                        total = 0;
                        break;
                    default:
                        var lstMiscCosts = repositoryMiscCosts.List(gridRequest);
                        // Hides unit sales price fields from supplier
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                        {
                            foreach (var mscCost in lstMiscCosts)
                                HideFieldsFromSupplier(mscCost);
                        }
                        data = lstMiscCosts;
                        total = (int) RepositoryShared<TMMISCCOSTS>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });

            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMiscCostsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMISCCOSTS nMiscCost)
        {

            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                if (nMiscCost.MSC_ID != 0)
                {
                    var misccostondb = repositoryMiscCosts.Get(nMiscCost.MSC_ID);
                    nMiscCost.MSC_UNITSALESPRICE = misccostondb.MSC_UNITSALESPRICE;
                    nMiscCost.MSC_FIXED = misccostondb.MSC_FIXED;
                    if (misccostondb.MSC_FIXED == '+')
                    {
                        nMiscCost.MSC_UNITPRICE = misccostondb.MSC_UNITPRICE;
                        nMiscCost.MSC_TOTAL = nMiscCost.MSC_UNITPRICE * nMiscCost.MSC_EXCH * nMiscCost.MSC_QTY;
                    }
                }
                else
                {
                    if (nMiscCost.MSC_PART.HasValue)
                    {
                        var contractPartPrices = repositoryContractPartPrices.GetContractPartPrices(new GetContractPartPricesParam
                        {
                            Part = nMiscCost.MSC_PART.Value,
                            Task = (int)nMiscCost.MSC_TASK
                        });
                        if (contractPartPrices.Count > 0)
                        {
                            var firstPartPrice = contractPartPrices.First();
                            if (firstPartPrice.CPP_UNITPURCHASEPRICE.HasValue)
                                nMiscCost.MSC_UNITPRICE = firstPartPrice.CPP_UNITPURCHASEPRICE.Value;
                            nMiscCost.MSC_UNITSALESPRICE = firstPartPrice.CPP_UNITSALESPRICE;
                            nMiscCost.MSC_PARTREFERENCE = firstPartPrice.CPP_REFERENCE;
                            nMiscCost.MSC_TOTAL = nMiscCost.MSC_UNITPRICE * nMiscCost.MSC_EXCH * nMiscCost.MSC_QTY;
                            nMiscCost.MSC_FIXED = '+';
                        }
                    }
                }
            }
            else
            {
                if (nMiscCost.MSC_ID != 0)
                {
                    var misccostondb = repositoryMiscCosts.Get(nMiscCost.MSC_ID);
                    if (misccostondb.MSC_UNITPRICE != nMiscCost.MSC_UNITPRICE)
                        nMiscCost.MSC_FIXED = '-';
                }
            }

            repositoryMiscCosts.SaveOrUpdate(nMiscCost);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10123", UserManager.Instance.User.Language),
                r = nMiscCost
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var misccost = repositoryMiscCosts.Get(id);
                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                    HideFieldsFromSupplier(misccost);

                return JsonConvert.SerializeObject(new { status = 200, data = misccost });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMiscCostsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryMiscCosts.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10124", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string SetMisccostProfitMargin(List<TMMISCCOSTS> miscCostList)
        {

            foreach (var misccost in miscCostList)
            {
                repositoryMiscCosts.SaveOrUpdate(misccost);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10123", UserManager.Instance.User.Language),

            });
        }
    }
}