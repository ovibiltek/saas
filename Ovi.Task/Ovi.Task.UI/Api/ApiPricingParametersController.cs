using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPricingParametersController : ApiController
    {
        private RepositoryPricingParameters repositoryPricingParameters;

        public ApiPricingParametersController()
        {
            repositoryPricingParameters = new RepositoryPricingParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PRP_ORG");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPRICINGPARAMETERS>.Count(gridRequest)
                    : repositoryPricingParameters.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingParametersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPRICINGPARAMETERS nPricingParameter)
        {
            repositoryPricingParameters.SaveOrUpdate(nPricingParameter);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10104", UserManager.Instance.User.Language),
                r = nPricingParameter
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var pricingParameter = repositoryPricingParameters.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pricingParameter });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingParametersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryPricingParameters.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10105", UserManager.Instance.User.Language)
            });
        }
    }
}