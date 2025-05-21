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
using static Ovi.Task.Data.Repositories.RepositoryContractServicePrices;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiContractServicePricesController : ApiController
    {
        private RepositoryContractServicePrices repositoryContractServicePrices;

        public ApiContractServicePricesController()
        {
            repositoryContractServicePrices = new RepositoryContractServicePrices();
        }

        public class DeleteLines
        {
            public List<int> Lines { get; set; }
        }

        private IList<TMCONTRACTSERVICEPRICES> HideFieldValuesFromSupplier(IList<TMCONTRACTSERVICEPRICES> data)
        {
            foreach (var d in data)
            {
                d.CSP_UNITSALESPRICE = 0;
            }
            return data;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {

                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var servicePriceForQuotation = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "GetServicePriceForQuotation");
                if (servicePriceForQuotation != null)
                {
                    servicePriceForQuotation.Field = null;
                    servicePriceForQuotation.Logic = "and";
                    servicePriceForQuotation.Operator = "sqlfunc";
                    servicePriceForQuotation.Value =
                        string.Format("(CSP_ID = (SELECT CSP_ID FROM dbo.GetServicePriceForQuotation({0},{1})))",
                            servicePriceForQuotation.Value, servicePriceForQuotation.Value2);

                }

                var servicePriceForTask = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "GetServicePriceForTask");
                if (servicePriceForTask != null)
                {
                    servicePriceForTask.Field = null;
                    servicePriceForTask.Logic = "and";
                    servicePriceForTask.Operator = "sqlfunc";
                    servicePriceForTask.Value =
                        string.Format("(CSP_ID = (SELECT CSP_ID FROM dbo.GetServicePriceForTask({0},{1})))",
                            servicePriceForTask.Value, servicePriceForTask.Value2);

                }

                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMCONTRACTSERVICEPRICES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryContractServicePrices.List(gridRequest);
                        total = RepositoryShared<TMCONTRACTSERVICEPRICES>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                        {
                            data = HideFieldValuesFromSupplier((IList<TMCONTRACTSERVICEPRICES>)data);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractServicePricesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCONTRACTSERVICEPRICES nContractServicePrices)
        {
            repositoryContractServicePrices.SaveOrUpdate(nContractServicePrices, nContractServicePrices.CSP_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10448", UserManager.Instance.User.Language),
                r = nContractServicePrices
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var contractserviceprices = repositoryContractServicePrices.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = contractserviceprices });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractServicePricesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryContractServicePrices.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10449", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        public string GetReference(ReferenceParams refParams)
        {
            try
            {
                var result = repositoryContractServicePrices.GetReference(refParams);
                return JsonConvert.SerializeObject(new { status = 200, data = result });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractServicePricesController", "GetReference");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DeleteAll(DeleteLines lines)
        {
            foreach (var item in lines.Lines)
            {
                repositoryContractServicePrices.DeleteById(item);
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10449", UserManager.Instance.User.Language) });

        }
    }
}