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
    public class ApiPricingCodeParametersController : ApiController
    {
        private RepositoryPricingCodeParameters repositoryPricingCodeParameters;

        public ApiPricingCodeParametersController()
        {
            repositoryPricingCodeParameters = new RepositoryPricingCodeParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPRICINGCODEPARAMETERS>.Count(gridRequest)
                    : repositoryPricingCodeParameters.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingCodeParametersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPRICINGCODEPARAMETERS nPricingCodeParameter)
        {
            repositoryPricingCodeParameters.SaveOrUpdate(nPricingCodeParameter);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10170", UserManager.Instance.User.Language), r = nPricingCodeParameter });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var pcp = repositoryPricingCodeParameters.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pcp });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingCodeParametersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPricingCodeParameters.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10171", UserManager.Instance.User.Language) });
        }
    }
}