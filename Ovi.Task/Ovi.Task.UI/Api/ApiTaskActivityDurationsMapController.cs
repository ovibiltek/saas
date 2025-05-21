using Newtonsoft.Json;
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
    public class ApiTaskActivityDurationsMapController : ApiController
    {
        private RepositoryTaskActivityDurationsMap repositoryTaskActivityDurationsMap;

        public ApiTaskActivityDurationsMapController()
        {
            repositoryTaskActivityDurationsMap = new RepositoryTaskActivityDurationsMap();
        }

        [HttpPost]
        public string List(TaskActivityDurationParameters taskActivityDurationParameters)
        {
            try
            {
                var data = repositoryTaskActivityDurationsMap.List(taskActivityDurationParameters);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityDurationsMapController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Find(TaskActivityFinderParameters taskActivityFinderParameters)
        {
            try
            {
                var data = repositoryTaskActivityDurationsMap.Find(taskActivityFinderParameters);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityDurationsMapController", "Find");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}