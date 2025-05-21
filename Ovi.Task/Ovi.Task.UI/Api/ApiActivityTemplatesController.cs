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
    public class ApiActivityTemplatesController : ApiController
    {
        private RepositoryActivityTemplates repositoryActivityTemplates;

        public ApiActivityTemplatesController()
        {
            repositoryActivityTemplates = new RepositoryActivityTemplates();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMACTIVITYTEMPLATES>.Count(gridRequest)
                    : repositoryActivityTemplates.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiActivityTemplatesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMACTIVITYTEMPLATES nActivityTemplate)
        {
            repositoryActivityTemplates.SaveOrUpdate(nActivityTemplate);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10050", UserManager.Instance.User.Language), r = nActivityTemplate });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var typeActivity = repositoryActivityTemplates.Get(id);

                if (typeActivity != null)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = new
                        {
                            typeActivity.TAT_ID,
                            typeActivity.TAT_TYPE,
                            typeActivity.TAT_ENTITY,
                            typeActivity.TAT_CODE,
                            typeActivity.TAT_LINE,
                            typeActivity.TAT_DESC,
                            typeActivity.TAT_STATUS,
                            typeActivity.TAT_TASKDEPARTMENT,
                            typeActivity.TAT_TASKDESC,
                            typeActivity.TAT_DEPARTMENT,
                            TAT_DEPARTMENTDESC = (!string.IsNullOrEmpty(typeActivity.TAT_DEPARTMENT) ? new RepositoryDepartments().Get(typeActivity.TAT_DEPARTMENT).DEP_DESCF : null),
                            TAT_ASSIGNEDTO = new RepositoryUsers().GetUsers(typeActivity.TAT_ASSIGNEDTO),
                            typeActivity.TAT_PREDECESSOR,
                            typeActivity.TAT_PREDECESSORDESC,
                            typeActivity.TAT_CHKLISTTMP,
                            TAT_CHKLISTTMPDESC = (typeActivity.TAT_CHKLISTTMP != null ? new RepositoryChecklistTemplates().Get(typeActivity.TAT_CHKLISTTMP).CLT_DESC : null),
                            typeActivity.TAT_LMAPPROVALREQUIRED,
                            typeActivity.TAT_CREATESEPARATEACTIVITY,
                            typeActivity.TAT_HIDDEN,
                            typeActivity.TAT_CREATED,
                            typeActivity.TAT_CREATEDBY,
                            typeActivity.TAT_UPDATED,
                            typeActivity.TAT_UPDATEDBY,
                            typeActivity.TAT_RECORDVERSION
                        }
                    });
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = (string)null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiActivityTemplatesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryActivityTemplates.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10051", UserManager.Instance.User.Language) });
        }
    }
}