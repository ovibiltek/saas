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
    public class ApiDepartmentsController : ApiController
    {
        private RepositoryDepartments repositoryDepartments;

        public ApiDepartmentsController()
        {
            repositoryDepartments = new RepositoryDepartments();
            ;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "DEP_ORG");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMDEPARTMENTS>.Count(gridRequest)
                    : repositoryDepartments.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDepartmentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMDEPARTMENTS nDepartment)
        {
            repositoryDepartments.SaveOrUpdate(nDepartment);
            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMDEPARTMENTS",
                DES_PROPERTY = "DEP_DESC",
                DES_CODE = nDepartment.DEP_CODE,
                DES_TEXT = nDepartment.DEP_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10011", UserManager.Instance.User.Language),
                r = nDepartment,
                authorizedusers = new RepositoryUsers().GetUsers(nDepartment.DEP_AUTHORIZED)
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var dep = repositoryDepartments.Get(id);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    r = dep,
                    authorizedusers = new RepositoryUsers().GetUsers(dep.DEP_AUTHORIZED)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDepartmentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryDepartments.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10012", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string GetDepartments([FromBody]string user)
        {
            try
            {
                var departments = repositoryDepartments.GetDepartments(user, '+');

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = departments
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDepartments", "GetDepartments");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}