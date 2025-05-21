using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiQuotationPartController : ApiController
    {
        private RepositoryQuotationPart repositoryQuotationPart;

        public ApiQuotationPartController()
        {
            repositoryQuotationPart = new RepositoryQuotationPart();
        }

        private IList<TMQUOTATIONPART> HideFieldValuesFromSupplier(IList<TMQUOTATIONPART> data)
        {
            foreach (var d in data)
            {
                d.PAR_SALESEXCH = null;
                d.PAR_SALESPRICECURR = null;
                d.PAR_UNITSALESPRICE = null;
                d.PAR_SALESDISCOUNTRATE = null;
                d.PAR_SALESDISCOUNTEDUNITPRICE = null;
                d.PAR_TOTALSALESPRICE = null;
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
                        data = RepositoryShared<TMQUOTATIONPART>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryQuotationPart.List(gridRequest);
                        total = RepositoryShared<TMQUOTATIONPART>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                            data = HideFieldValuesFromSupplier((IList<TMQUOTATIONPART>)data);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationPartController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMQUOTATIONPART quotationPart)
        {
            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                if (quotationPart.PAR_ID != 0)
                {
                    var quopart = repositoryQuotationPart.Get(quotationPart.PAR_ID);
                    quotationPart.PAR_SALESEXCH = quopart.PAR_SALESEXCH;
                    quotationPart.PAR_SALESPRICECURR = quopart.PAR_SALESPRICECURR;
                    quotationPart.PAR_UNITSALESPRICE = quopart.PAR_UNITSALESPRICE;
                    quotationPart.PAR_TOTALSALESPRICE = quopart.PAR_TOTALSALESPRICE;
                }
            }
            repositoryQuotationPart.SaveOrUpdate(quotationPart);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10413", UserManager.Instance.User.Language),
                r = quotationPart
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var quotationpart = repositoryQuotationPart.Get(id);
                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                {
                    quotationpart.PAR_SALESEXCH = null;
                    quotationpart.PAR_SALESPRICECURR = null;
                    quotationpart.PAR_UNITSALESPRICE = null;
                    quotationpart.PAR_TOTALSALESPRICE = null;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = quotationpart
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationPartController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryQuotationPart.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10414", UserManager.Instance.User.Language)
            });
        }
    }
}