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
    public class ApiPlannedPartsController : ApiController
    {
        private RepositoryPlannedParts repositoryPlannedParts;

        public ApiPlannedPartsController()
        {
            repositoryPlannedParts = new RepositoryPlannedParts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPLANNEDPARTS>.Count(gridRequest)
                    : repositoryPlannedParts.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPlannedPartsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPLANNEDPARTS nPlannedPart)
        {
            repositoryPlannedParts.SaveOrUpdate(nPlannedPart);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10161", UserManager.Instance.User.Language),
                r = nPlannedPart
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var plnpart = repositoryPlannedParts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = plnpart });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPlannedPartsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPlannedParts.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10162", UserManager.Instance.User.Language) });
        }
    }
}