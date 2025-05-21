using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Quotation;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiQuotationMiscCostController : ApiController
    {
        private RepositoryQuotationMiscCost repositoryQuotationMiscCost;

        public ApiQuotationMiscCostController()
        {
            repositoryQuotationMiscCost = new RepositoryQuotationMiscCost();
        }

        private IList<TMQUOTATIONMISCCOST> HideFieldValuesFromSupplier(IList<TMQUOTATIONMISCCOST> data)
        {
            foreach (var d in data)
            {
                d.MSC_SALESEXCH = null;
                d.MSC_SALESPRICECURR = null;
                d.MSC_UNITSALESPRICE = null;
                d.MSC_SALESDISCOUNTRATE = null;
                d.MSC_SALESDISCOUNTEDUNITPRICE = null;
                d.MSC_TOTALSALESPRICE = null;
            }
            return data;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMQUOTATIONMISCCOST>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryQuotationMiscCost.List(gridRequest);
                        total = RepositoryShared<TMQUOTATIONMISCCOST>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                            data = HideFieldValuesFromSupplier((IList<TMQUOTATIONMISCCOST>)data);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationMiscCostController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMQUOTATIONMISCCOST quotationMiscCost)
        {
            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                if (quotationMiscCost.MSC_ID != 0)
                {
                    var quomisccost = repositoryQuotationMiscCost.Get(quotationMiscCost.MSC_ID);
                    quotationMiscCost.MSC_SALESEXCH = quomisccost.MSC_SALESEXCH;
                    quotationMiscCost.MSC_SALESPRICECURR = quomisccost.MSC_SALESPRICECURR;
                    quotationMiscCost.MSC_UNITSALESPRICE = quomisccost.MSC_UNITSALESPRICE;
                    quotationMiscCost.MSC_TOTALSALESPRICE = quomisccost.MSC_TOTALSALESPRICE;
                }
            }
            repositoryQuotationMiscCost.SaveOrUpdate(quotationMiscCost);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10415", UserManager.Instance.User.Language),
                r = quotationMiscCost
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var quotationMiscCost = repositoryQuotationMiscCost.Get(id);
                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                {
                    quotationMiscCost.MSC_SALESEXCH = null;
                    quotationMiscCost.MSC_SALESPRICECURR = null;
                    quotationMiscCost.MSC_UNITSALESPRICE = null;
                    quotationMiscCost.MSC_TOTALSALESPRICE = null;
                }
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = quotationMiscCost
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationMiscCostController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryQuotationMiscCost.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10416", UserManager.Instance.User.Language)
            });
        }
    }
}