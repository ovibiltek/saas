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
    public class ApiFixedCostsController : ApiController
    {
        private RepositoryFixedCosts repositoryFixedCosts;

        public ApiFixedCostsController()
        {
            repositoryFixedCosts = new RepositoryFixedCosts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMFIXEDCOSTS>.Count(gridRequest)
                    : repositoryFixedCosts.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFixedCostsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMFIXEDCOSTS nFixedCost)
        {
            repositoryFixedCosts.SaveOrUpdate(nFixedCost);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10173", UserManager.Instance.User.Language), r = nFixedCost });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var fixedcost = repositoryFixedCosts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = fixedcost });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFixedCostsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryFixedCosts.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10174", UserManager.Instance.User.Language)
            });
        }
    }
}