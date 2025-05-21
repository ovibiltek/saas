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
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiContractPartPricesController : ApiController
    {
        private RepositoryContractPartPrices repositoryContractPartPrices;
        public class DeleteLines
        {
            public List<int> Lines { get; set; }
        }
        public ApiContractPartPricesController()
        {
            repositoryContractPartPrices = new RepositoryContractPartPrices();
        }

        private IList<TMCONTRACTPARTPRICES> HideFieldValuesFromSupplier(IList<TMCONTRACTPARTPRICES> data)
        {
            foreach (var d in data)
            {
                d.CPP_UNITSALESPRICE = 0;
            }
            return data;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {

                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var partPriceForQuotation = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "GetPartPriceForQuotation");
                if (partPriceForQuotation != null)
                {
                    partPriceForQuotation.Field = null;
                    partPriceForQuotation.Logic = "and";
                    partPriceForQuotation.Operator = "sqlfunc";
                    partPriceForQuotation.Value =
                        string.Format("(CPP_ID = (SELECT CPP_ID FROM dbo.GetPartPriceForQuotation({0},{1})))",
                            partPriceForQuotation.Value, partPriceForQuotation.Value2);

                }

                var partPriceForTask = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "GetPartPriceForTask");
                if (partPriceForTask != null)
                {
                    partPriceForTask.Field = null;
                    partPriceForTask.Logic = "and";
                    partPriceForTask.Operator = "sqlfunc";
                    partPriceForTask.Value =
                        string.Format("(CPP_ID = (SELECT CPP_ID FROM dbo.GetPartPriceForTask({0},{1})))",
                            partPriceForTask.Value, partPriceForTask.Value2);

                }

                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMCONTRACTPARTPRICES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryContractPartPrices.List(gridRequest);
                        total = RepositoryShared<TMCONTRACTPARTPRICES>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                        {
                            data = HideFieldValuesFromSupplier((IList<TMCONTRACTPARTPRICES>)data);
                        }

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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractPartPricesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetContractPartPrices(GetContractPartPricesParam pGetContractPartPricesParam)
        {
            try
            {
                var contractpartprices = repositoryContractPartPrices.GetContractPartPrices(pGetContractPartPricesParam);
                return JsonConvert.SerializeObject(new { status = 200, data = contractpartprices });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractPartPricesController", "GetContractPartPrices");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetReference(RepositoryContractPartPrices.ReferenceParams refParams)
        {
            try
            {
                var result = repositoryContractPartPrices.GetReference(refParams);
                return JsonConvert.SerializeObject(new { status = 200, data = result });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractPartPricesController", "GetReference");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCONTRACTPARTPRICES nContractPartPrice)
        {
            repositoryContractPartPrices.SaveOrUpdate(nContractPartPrice, nContractPartPrice.CPP_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10203", UserManager.Instance.User.Language),
                r = nContractPartPrice
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var contractpartprice = repositoryContractPartPrices.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = contractpartprice });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractPartPricesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryContractPartPrices.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10204", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        [Transaction]
        public string DeleteAll(DeleteLines lines)
        {
            foreach (var item in lines.Lines)
            {
                repositoryContractPartPrices.DeleteById(item);
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10204", UserManager.Instance.User.Language) });
        }
    }

}