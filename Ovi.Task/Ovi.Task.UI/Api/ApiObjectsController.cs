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
    public class ApiObjectsController : ApiController
    {
        private RepositoryObjects repositoryObjects;

        public ApiObjectsController()
        {
            repositoryObjects = new RepositoryObjects();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "OBJ_ORG");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMOBJECTSVIEW>.Count(gridRequest)
                    : repositoryObjects.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiObjectsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var obj = repositoryObjects.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = obj });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiObjectsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}