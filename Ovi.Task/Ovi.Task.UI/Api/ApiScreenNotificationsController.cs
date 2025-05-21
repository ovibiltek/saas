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
    public class ApiScreenNotificationsController : ApiController
    {
        private RepositoryScreenNotifications repositoryScreenNotifications;

        public ApiScreenNotificationsController()
        {
            repositoryScreenNotifications = new RepositoryScreenNotifications();
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
                        data = RepositoryShared<TMSCREENNOTIFICATIONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryScreenNotifications.List(gridRequest);
                        total = RepositoryShared<TMSCREENNOTIFICATIONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiScreenNotificationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSCREENNOTIFICATIONS nScreenNotification)
        {
            repositoryScreenNotifications.SaveOrUpdate(nScreenNotification);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10417", UserManager.Instance.User.Language),
                r = nScreenNotification
            });
        }

        [HttpPost]
        [Transaction]
        public string DoNotShow([FromBody] long id)
        {
            var screenNotification = repositoryScreenNotifications.Get(id);
            repositoryScreenNotifications.DoNotShowAgain(screenNotification);
            return JsonConvert.SerializeObject(new { status = 200 });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var screennotification = repositoryScreenNotifications.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = screennotification });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiScreenNotificationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryScreenNotifications.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10418", UserManager.Instance.User.Language),
            });
        }

    }
}