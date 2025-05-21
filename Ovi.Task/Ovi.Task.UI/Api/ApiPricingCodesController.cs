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
    public class ApiPricingCodesController : ApiController
    {
        private RepositoryPricingCodes repositoryPricingCodes;

        public ApiPricingCodesController()
        {
            repositoryPricingCodes = new RepositoryPricingCodes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPRICINGCODES>.Count(gridRequest)
                    : repositoryPricingCodes.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingCodesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPRICINGCODES nPricingCode)
        {
            repositoryPricingCodes.SaveOrUpdate(nPricingCode);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10168", UserManager.Instance.User.Language), r = nPricingCode });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var pricingcode = repositoryPricingCodes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pricingcode });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingCodesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryPricingCodes.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10169", UserManager.Instance.User.Language) });
        }
    }
}