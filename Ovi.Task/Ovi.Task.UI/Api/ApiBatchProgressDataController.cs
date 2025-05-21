using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiBatchProgressDataController : ApiController
    {
        private RepositoryBatchProgressData repositoryBatchProgressData;

        public ApiBatchProgressDataController()
        {
            repositoryBatchProgressData = new RepositoryBatchProgressData();
        }

        [HttpPost]
        public string GetLastRunningByType([FromBody]string type)
        {
            try
            {
                var data = repositoryBatchProgressData.GetLastRunningByType(type);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBatchProgressDataController", "GetLastRunningByType");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}