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
    public class ApiUserGroupKPIController : ApiController
    {
        public class prmSave
        {
            public string Id { get; set; }

            public TMUSERGROUPKPIS[] Items { get; set; }
        }

        private RepositoryUserGroupKPIs repositoryUserGroupKPIs;

        public ApiUserGroupKPIController()
        {
            repositoryUserGroupKPIs = new RepositoryUserGroupKPIs();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMUSERGROUPKPIS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryUserGroupKPIs.List(gridRequest);
                        total = RepositoryShared<TMUSERGROUPKPIS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserGroupKPIController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(prmSave p)
        {
            repositoryUserGroupKPIs.Save(p.Id, p.Items);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10092", UserManager.Instance.User.Language),
                r = p
            });
        }
    }
}