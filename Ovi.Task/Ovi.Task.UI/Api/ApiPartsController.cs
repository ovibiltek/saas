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
using Newtonsoft.Json.Linq;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPartsController : ApiController
    {
        private RepositoryParts repositoryParts;

        public ApiPartsController()
        {
            repositoryParts = new RepositoryParts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PAR_ORG");

                var contractedTaskPart = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "IsContractedTaskPart");
                if (contractedTaskPart != null)
                {
                    contractedTaskPart.Field = null;
                    contractedTaskPart.Logic = "and";
                    contractedTaskPart.Operator = "sqlfunc";
                    contractedTaskPart.Value =
                        string.Format("EXISTS (SELECT 1 FROM dbo.GetContractedPartsForTask({0}) WHERE CPP_PART = PAR_ID)",
                            contractedTaskPart.Value);

                }

                var contractedQuotationPart = gridRequest.filter?.Filters.FirstOrDefault(x => x.Field == "IsContractedQuotationPart");
                if (contractedQuotationPart != null)
                {
                    contractedQuotationPart.Field = null;
                    contractedQuotationPart.Logic = "and";
                    contractedQuotationPart.Operator = "sqlfunc";
                    contractedQuotationPart.Value =
                        string.Format("EXISTS (SELECT 1 FROM dbo.GetContractedPartsForQuotation({0}) WHERE CPP_PART = PAR_ID)",
                            contractedQuotationPart.Value);

                }

                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPARTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryParts.List(gridRequest);
                        total = RepositoryShared<TMPARTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(PartModel mPart)
        {
            repositoryParts.SaveOrUpdate(mPart.Part);

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("PART", mPart.Part.PAR_ID.ToString(), mPart.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10069", UserManager.Instance.User.Language),
                parid = mPart.Part.PAR_ID
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var par = repositoryParts.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = par
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetPartPrice(RepositoryParts.PartPriceParams partPriceParams)
        {
            try
            {
                var partprice = repositoryParts.GetPartPrice(partPriceParams);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = partprice
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartsController", "GetPartPrice");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryParts.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10070", UserManager.Instance.User.Language)
            });
        }
    }
}