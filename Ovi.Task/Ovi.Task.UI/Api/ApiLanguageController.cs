using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
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
    public class ApiLanguageController : ApiController
    {
        private RepositoryLangs repositoryLangs;

        public ApiLanguageController()
        {
            repositoryLangs = new RepositoryLangs();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstOfLanguages = repositoryLangs.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = lstOfLanguages });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLanguageController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var lang = repositoryLangs.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = lang });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLanguageController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}