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
    public class ApiPricingParameterRelationsController : ApiController
    {
        private RepositoryPricingParameterRelations repositoryPricingParameterRelations;

        public ApiPricingParameterRelationsController()
        {
            repositoryPricingParameterRelations = new RepositoryPricingParameterRelations();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPRICINGPARAMETERRELATIONS>.Count(gridRequest)
                    : repositoryPricingParameterRelations.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingParameterRelationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPRICINGPARAMETERRELATIONS nPricingParameterRelation)
        {
            repositoryPricingParameterRelations.SaveOrUpdate(nPricingParameterRelation);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10106", UserManager.Instance.User.Language),
                id = nPricingParameterRelation.PPR_ID
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var pricingParameterRelation = repositoryPricingParameterRelations.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pricingParameterRelation });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPricingParameterRelationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPricingParameterRelations.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10107", UserManager.Instance.User.Language)
            });
        }
    }
}