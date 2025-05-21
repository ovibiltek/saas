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
    public class ApiDepartmentCategoriesController : ApiController
    {
        public class prmSave
        {
            public string Id { get; set; }

            public TMDEPARTMENTCATEGORIES[] Items { get; set; }
        }

        private RepositoryDepartmentCategories repositoryDepartmentCategories;

        public ApiDepartmentCategoriesController()
        {
            repositoryDepartmentCategories = new RepositoryDepartmentCategories();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMDEPARTMENTCATEGORIES>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryDepartmentCategories.List(gridRequest);
                    total = RepositoryShared<TMDEPARTMENTCATEGORIES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDepartmentCategoriesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(prmSave p)
        {
            repositoryDepartmentCategories.Save(p.Id, p.Items);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10188", UserManager.Instance.User.Language),
                r = p
            });
        }
    }
}