using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiServiceCodesController : ApiController
    {
        private RepositoryServiceCodes repositoryServiceCodes;

        public ApiServiceCodesController()
        {
            repositoryServiceCodes = new RepositoryServiceCodes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                var contractedTaskServiceCode = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "IsContractedTaskServiceCode");
                if (contractedTaskServiceCode != null)
                {
                    contractedTaskServiceCode.Field = null;
                    contractedTaskServiceCode.Logic = "and";
                    contractedTaskServiceCode.Operator = "sqlfunc";
                    contractedTaskServiceCode.Value =
                        string.Format("EXISTS (SELECT 1 FROM dbo.GetContractedServiceCodesForTask({0}) WHERE CSP_SERVICECODE = SRV_CODE)",
                            contractedTaskServiceCode.Value);

                }

                var contractedQuotationServiceCode = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "IsContractedQuotationServiceCode");
                if (contractedQuotationServiceCode != null)
                {
                    contractedQuotationServiceCode.Field = null;
                    contractedQuotationServiceCode.Logic = "and";
                    contractedQuotationServiceCode.Operator = "sqlfunc";
                    contractedQuotationServiceCode.Value =
                        string.Format("EXISTS (SELECT 1 FROM dbo.GetContractedServiceCodesForQuotation({0}) WHERE CSP_SERVICECODE = SRV_CODE)",
                            contractedQuotationServiceCode.Value);

                }

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSERVICECODES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryServiceCodes.List(gridRequest);
                        total = RepositoryShared<TMSERVICECODES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiServiceCodesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSERVICECODES nServiceCode)
        {
            repositoryServiceCodes.SaveOrUpdate(nServiceCode);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10419", UserManager.Instance.User.Language),
                r = nServiceCode
            });
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var serviceCode = repositoryServiceCodes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = serviceCode });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiServiceCodesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositoryServiceCodes.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10420", UserManager.Instance.User.Language)
            });
        }
    }
}