using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    public class ApiTaskCountsByBranchesController:ApiController
    {
        private RepositoryTaskCountsByBranches repositoryTaskCountsByBranches;

        public ApiTaskCountsByBranchesController()
        {
            repositoryTaskCountsByBranches = new RepositoryTaskCountsByBranches();
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
                        data = RepositoryShared<TMTASKCOUNTSBYBRANCHESVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskCountsByBranches.List(gridRequest);
                        total = RepositoryShared<TMTASKCOUNTSBYBRANCHESVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskCountsByBranchesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}