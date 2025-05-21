using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiAuditController : ApiController
    {
        private RepositoryAuditFields repositoryAuditFields;
        private RepositoryAudit repositoryAudit;
        private RepositoryAuditClasses repositoryAuditClasses;


        public ApiAuditController()
        {
            repositoryAuditFields = new RepositoryAuditFields();
            repositoryAudit = new RepositoryAudit();
            repositoryAuditClasses = new RepositoryAuditClasses();
        }

        [HttpPost]
        public string ListLines(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMAUDIT>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryAudit.ListView(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (TmsException te)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = te.Message });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiAuditController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string List([FromBody] string cls)
        {
            try
            {
                var auditClass = repositoryAuditClasses.GetByClass(cls);
                if (auditClass == null) return null;

                var entitiesAssembly = typeof(TMTASKS).Assembly;
                var entityType = entitiesAssembly.GetType(string.Format("{0}.{1}", auditClass.AUC_NAMESPACE, auditClass.AUC_CLASS));

                var helperAssembly = typeof(PropertyHelper).Assembly;
                var method = helperAssembly.GetType("Ovi.Task.Helper.Functional.PropertyHelper").GetMethod("List").MakeGenericMethod(entityType);

                var properties = method.Invoke(null, null);
                var values = new RepositoryAuditFields().ListByClass(cls);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = properties,
                    values
                });

            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiAuditController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMAUDITFIELDS[] auditfields)
        {
            repositoryAuditFields.SaveList(auditfields);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10028", UserManager.Instance.User.Language),
                r = auditfields
            });
        }
    }
}