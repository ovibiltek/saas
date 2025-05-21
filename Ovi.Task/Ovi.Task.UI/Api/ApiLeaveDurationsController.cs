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
    public class ApiLeaveDurationsController : ApiController
    {
        private RepositoryLeaveDurations repositoryLeaveDurations;

        public ApiLeaveDurationsController()
        {
            repositoryLeaveDurations = new RepositoryLeaveDurations();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMLEAVEDURATIONS>.Count(gridRequest)
                    : repositoryLeaveDurations.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLeaveDurationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetLeaveDurationByType([FromBody] string type)
        {
            try
            {
                var leaveDuration = repositoryLeaveDurations.GetLeaveDurationByType(type);
                return JsonConvert.SerializeObject(new { status = 200, data = leaveDuration });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLeaveDurationsController", "GetLeaveDurationByType");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMLEAVEDURATIONS nLeaveDuration)
        {
            repositoryLeaveDurations.SaveOrUpdate(nLeaveDuration);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10192", UserManager.Instance.User.Language), r = nLeaveDuration });
        }

        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var brand = repositoryLeaveDurations.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = brand });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLeaveDurationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] string id)
        {
            repositoryLeaveDurations.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10193", UserManager.Instance.User.Language) });
        }
    }
}