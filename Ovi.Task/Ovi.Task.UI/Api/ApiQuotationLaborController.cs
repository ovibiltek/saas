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
    public class ApiQuotationLaborController : ApiController
    {
        private RepositoryQuotationLabor repositoryQuotationLabor;

        public ApiQuotationLaborController()
        {
            repositoryQuotationLabor = new RepositoryQuotationLabor();
        }

        private IList<TMQUOTATIONLABOR> HideFieldValuesFromSupplier(IList<TMQUOTATIONLABOR> data)
        {
            foreach (var d in data)
            {
                d.LAB_SALESEXCH = null;
                d.LAB_SALESPRICECURR = null;
                d.LAB_UNITSALESPRICE = null;
                d.LAB_SALESDISCOUNTRATE = null;
                d.LAB_SALESDISCOUNTEDUNITPRICE = null;
                d.LAB_TOTALSALESPRICE = null;
            }
            return data;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                object data;
                long total = 0;
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMQUOTATIONLABOR>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryQuotationLabor.List(gridRequest);
                        total = RepositoryShared<TMQUOTATIONLABOR>.Count(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                            data = HideFieldValuesFromSupplier((IList<TMQUOTATIONLABOR>)data);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMQUOTATIONLABOR quotationLabor)
        {
            if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
            {
                if (quotationLabor.LAB_ID != 0)
                {
                    var quolabor = repositoryQuotationLabor.Get(quotationLabor.LAB_ID);
                    quotationLabor.LAB_SALESEXCH = quolabor.LAB_SALESEXCH;
                    quotationLabor.LAB_SALESPRICECURR = quolabor.LAB_SALESPRICECURR;
                    quotationLabor.LAB_UNITSALESPRICE = quolabor.LAB_UNITSALESPRICE;
                    quotationLabor.LAB_TOTALSALESPRICE = quolabor.LAB_TOTALSALESPRICE;
                }
            }

            repositoryQuotationLabor.SaveOrUpdate(quotationLabor);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10406", UserManager.Instance.User.Language),
                r = quotationLabor
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                IList<TMUSEREXT> assignedto = null;
                var quotationLabor = repositoryQuotationLabor.Get(id);
                if (quotationLabor.LAB_ASSIGNEDTO != null)
                    assignedto = new RepositoryUsers().GetUsers(quotationLabor.LAB_ASSIGNEDTO);

                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                {
                    quotationLabor.LAB_SALESEXCH = null;
                    quotationLabor.LAB_SALESPRICECURR = null;
                    quotationLabor.LAB_UNITSALESPRICE = null;
                    quotationLabor.LAB_TOTALSALESPRICE = null;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = quotationLabor,
                    users = assignedto
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQuotationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryQuotationLabor.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10407", UserManager.Instance.User.Language)
            });
        }
    }
}