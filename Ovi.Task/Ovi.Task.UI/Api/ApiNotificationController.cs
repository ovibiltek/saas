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
    public class ApiNotificationController : ApiController
    {
        public class UpdateNotificationsAsReadParams
        {
            public string Subject { get; set; }

            public string Type { get; set; }

            public string Owner { get; set; }
        }

        private RepositoryNotifications repositoryNotifications;

        public ApiNotificationController()
        {
            repositoryNotifications = new RepositoryNotifications();
        }

        [HttpPost]
        public string GetCounts(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstNotifications = repositoryNotifications.GetCountList(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = lstNotifications });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiNotificationController", "GetCounts");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMNOTIFICATIONSVIEW>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryNotifications.ListView(gridRequest);
                    total = RepositoryShared<TMNOTIFICATIONSVIEW>.Count(gridRequest);
                }

                return JsonConvert.SerializeObject(new { status = 200, data, total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiNotificationController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string UpdateNotificationsAsRead(UpdateNotificationsAsReadParams updateNotificationsAsReadParams)
        {
            repositoryNotifications.UpdateNotificationsAsRead(updateNotificationsAsReadParams.Subject, updateNotificationsAsReadParams.Type, updateNotificationsAsReadParams.Owner);
            return JsonConvert.SerializeObject(new { status = 200, });
        }
    }
}