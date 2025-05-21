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
    public class ApiHistoryController : ApiController
    {
        private RepositoryAudit repositoryAudit;

        public ApiHistoryController()
        {
            repositoryAudit = new RepositoryAudit();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var auditList = repositoryAudit.ListAuditView(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = auditList });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHistoryController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}