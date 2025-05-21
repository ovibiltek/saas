using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.ProgressPayment;
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
    public class ApiProgressPaymentPricingController : ApiController
    {
        private RepositoryProgressPaymentPricing repositoryProgressPaymentPricing;

        public ApiProgressPaymentPricingController()
        {
            repositoryProgressPaymentPricing = new RepositoryProgressPaymentPricing();
        }

        private IList<TMPROGRESSPAYMENTPRICING> HideFieldValuesFromCustomer(IList<TMPROGRESSPAYMENTPRICING> data)
        {
            foreach (var d in data)
            {
                d.PRC_UNITPRICE = (d.PRC_UNITPRICE + (d.PRC_USERUNITPRICE.HasValue ? d.PRC_USERUNITPRICE.Value : 0));
                d.PRC_QTY = (d.PRC_QTY + (d.PRC_USERQTY.HasValue ? d.PRC_USERQTY.Value : 0));
                d.PRC_COST = 0;
                d.PRC_CALCPRICE = 0;
                d.PRC_USERQTY = 0;
                d.PRC_USERUNITPRICE = 0;
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
                gridRequest = GridRequestHelper.FilterMoreSpecificV1(gridRequest, "PRC_CUSTOMER", null, null);

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPROGRESSPAYMENTPRICING>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProgressPaymentPricing.List(gridRequest);
                        total = RepositoryShared<TMPROGRESSPAYMENTPRICING>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer))
                            data = HideFieldValuesFromCustomer((IList<TMPROGRESSPAYMENTPRICING>)data);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentPricingController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPROGRESSPAYMENTPRICING nPPP)
        {
            repositoryProgressPaymentPricing.SaveOrUpdate(nPPP);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = "No message",
                r = nPPP
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveList(ProgressPaymentPricing progressPaymentPricing)
        {
            var items = repositoryProgressPaymentPricing.ListByProgressPayment(progressPaymentPricing.ProgressPayment);
            var processList = new List<TMPROGRESSPAYMENTPRICING>();
            foreach (var item in items)
            {
                if (progressPaymentPricing.ProgressPaymentPricingList.Any(x => x.PRC_ID == item.PRC_ID))
                {
                    var itemWillBeSaved = progressPaymentPricing.ProgressPaymentPricingList.Single(x => x.PRC_ID == item.PRC_ID);
                    var newItem = (TMPROGRESSPAYMENTPRICING)item.Clone();
                    newItem.PRC_USERQTY = itemWillBeSaved.PRC_USERQTY;
                    newItem.PRC_USERUNITPRICE = itemWillBeSaved.PRC_USERUNITPRICE;
                    processList.Add(newItem);
                }
            }

            repositoryProgressPaymentPricing.Save(processList.ToArray());
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10127", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string ListByProgressPayment([FromBody] long progressPayment)
        {
            try
            {
                var data = repositoryProgressPaymentPricing.ListByProgressPayment(progressPayment);
                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer))
                    data = HideFieldValuesFromCustomer(data);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentPricingController", "ListByProgressPayment");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListByTask([FromBody] long taskid)
        {
            try
            {
                var data = repositoryProgressPaymentPricing.ListByTask(taskid);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentPricingController", "ListByTask");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var ppp = repositoryProgressPaymentPricing.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = ppp
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentPricing", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryProgressPaymentPricing.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = "No message"
            });
        }
    }
}