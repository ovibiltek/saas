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
    public class ApiUserGroupMobileTopicController : ApiController
    {
        public class prmSave
        {
            public string Id { get; set; }

            public TMUSERGROUPMOBILETOPICS[] Items { get; set; }
        }

        private RepositoryUserGroupMobileTopics repositoryUserGroupMobileTopics;

        public ApiUserGroupMobileTopicController()
        {
            repositoryUserGroupMobileTopics = new RepositoryUserGroupMobileTopics();
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
                        data = RepositoryShared<TMUSERGROUPMOBILETOPICS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryUserGroupMobileTopics.List(gridRequest);
                        total = RepositoryShared<TMUSERGROUPMOBILETOPICS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserGroupMobileTopicController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(prmSave p)
        {
            repositoryUserGroupMobileTopics.Save(p.Id, p.Items);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10451", UserManager.Instance.User.Language),
                r = p
            });
        }
    }
}