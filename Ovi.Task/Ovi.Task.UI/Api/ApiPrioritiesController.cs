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
    public class ApiPrioritiesController : ApiController
    {
        private RepositoryPriorities repositoryPriorities;

        public ApiPrioritiesController()
        {
            repositoryPriorities = new RepositoryPriorities();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PRI_ORGANIZATION");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPRIORITIES>.Count(gridRequest)
                    : repositoryPriorities.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPrioritiesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPRIORITIES nPriority)
        {
            repositoryPriorities.SaveOrUpdate(nPriority, nPriority.PRI_SQLIDENTITY == 0);

            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMPRIORITIES",
                DES_PROPERTY = "PRI_DESC",
                DES_CODE = nPriority.PRI_CODE,
                DES_TEXT = nPriority.PRI_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10003", UserManager.Instance.User.Language),
                r = nPriority
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var rec = repositoryPriorities.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = rec });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPrioritiesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryPriorities.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10004", UserManager.Instance.User.Language)
            });
        }
    }
}