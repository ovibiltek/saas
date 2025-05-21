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
    public class ApiDepartmentTypesController : ApiController
    {
        public class prmSave
        {
            public string Id { get; set; }

            public TMDEPARTMENTTYPES[] Items { get; set; }
        }

        private RepositoryDepartmentTypes repositoryDepartmentTypes;

        public ApiDepartmentTypesController()
        {
            repositoryDepartmentTypes = new RepositoryDepartmentTypes();
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
                    data = RepositoryShared<TMDEPARTMENTTYPES>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryDepartmentTypes.List(gridRequest);
                    total = RepositoryShared<TMDEPARTMENTTYPES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDepartmentTypesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(prmSave p)
        {
            repositoryDepartmentTypes.Save(p.Id, p.Items);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10091", UserManager.Instance.User.Language),
                r = p
            });
        }
    }
}