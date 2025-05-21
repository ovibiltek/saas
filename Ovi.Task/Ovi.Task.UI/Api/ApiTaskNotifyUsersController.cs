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
    public class ApiTaskNotifyUsersController : ApiController
    {
        public class prmSave
        {
            public long Id { get; set; }

            public TMTSKNOTIFYUSERS[] Items { get; set; }
        }

        private RepositoryTaskNotifyUsers repositoryTaskNotifyUsers;

        public ApiTaskNotifyUsersController()
        {
            repositoryTaskNotifyUsers = new RepositoryTaskNotifyUsers();
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
                    data = RepositoryShared<TMTSKNOTIFYUSERS>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryTaskNotifyUsers.List(gridRequest);
                    total = RepositoryShared<TMTSKNOTIFYUSERS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskNotifyUsersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(prmSave p)
        {
            repositoryTaskNotifyUsers.Save(p.Id, p.Items);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10088", UserManager.Instance.User.Language),
                r = p
            });
        }
    }
}