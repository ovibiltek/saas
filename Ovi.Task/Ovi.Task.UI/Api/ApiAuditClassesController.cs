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
    public class ApiAuditClassesController : ApiController
    {
        private RepositoryAuditClasses repositoryAuditClasses;

        public ApiAuditClassesController()
        {
            repositoryAuditClasses = new RepositoryAuditClasses();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lst = repositoryAuditClasses.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lst
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiAuditClassesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMAUDITCLASSES nAuditClasses)
        {
            repositoryAuditClasses.SaveOrUpdate(nAuditClasses);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10201", UserManager.Instance.User.Language), r = nAuditClasses });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var auditClass = repositoryAuditClasses.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = auditClass
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiAuditClassesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryAuditClasses.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10202", UserManager.Instance.User.Language)
            });
        }
    }
}