using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Task;
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
    public class ApiTaskActivityUsersController : ApiController
    {
        private RepositoryTaskActivityUsers repositoryTaskActivityUsers;

        public ApiTaskActivityUsersController()
        {
            repositoryTaskActivityUsers = new RepositoryTaskActivityUsers();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMTASKACTIVITYUSERS>.Count(gridRequest);
                object data = repositoryTaskActivityUsers.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data,
                    total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityUsersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}