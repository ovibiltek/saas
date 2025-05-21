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
    public class ApiPlannedMiscCostsController : ApiController
    {
        private RepositoryPlannedMiscCosts repositoryPlannedMiscCosts;

        public ApiPlannedMiscCostsController()
        {
            repositoryPlannedMiscCosts = new RepositoryPlannedMiscCosts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPLANNEDMISCCOSTS>.Count(gridRequest)
                    : repositoryPlannedMiscCosts.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPlannedMiscCostsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPLANNEDMISCCOSTS nPlannedMiscCost)
        {
            repositoryPlannedMiscCosts.SaveOrUpdate(nPlannedMiscCost);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10165", UserManager.Instance.User.Language),
                r = nPlannedMiscCost
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var plnmisccost = repositoryPlannedMiscCosts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = plnmisccost });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPlannedMiscCostsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPlannedMiscCosts.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10166", UserManager.Instance.User.Language) });
        }
    }
}