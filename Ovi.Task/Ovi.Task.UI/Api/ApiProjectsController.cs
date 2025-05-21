using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Project;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiProjectsController : ApiController
    {
        private RepositoryProjects repositoryProjects;

        public ApiProjectsController()
        {
            repositoryProjects = new RepositoryProjects();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PRJ_ORGANIZATION");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPROJECTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProjects.List(gridRequest);
                        total = RepositoryShared<TMPROJECTS>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProjectsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(ProjectModel mProject)
        {
            repositoryProjects.SaveOrUpdate(mProject.Project);

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("PROJECT", mProject.Project.PRJ_ID.ToString(), mProject.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10013", UserManager.Instance.User.Language),
                r = mProject
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var project = repositoryProjects.Get(id);
                var projectstatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = project.PRJ_STATUS, STA_ENTITY = "PROJECT" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = project,
                    stat = projectstatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProjectsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryProjects.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10014", UserManager.Instance.User.Language)
            });
        }
    }
}