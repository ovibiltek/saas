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
    public class ApiDashNotificationsController : ApiController
    {
        private RepositoryDashNotifications repositoryDashNotifications;

        public ApiDashNotificationsController()
        {
            repositoryDashNotifications = new RepositoryDashNotifications();
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
                        data = RepositoryShared<TMDASHNOTIFICATIONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryDashNotifications.List(gridRequest);
                        total = RepositoryShared<TMDASHNOTIFICATIONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDashNotificationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMDASHNOTIFICATIONS nDashNotification)
        {
            repositoryDashNotifications.SaveOrUpdate(nDashNotification);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10659", UserManager.Instance.User.Language),
                r = nDashNotification
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var cause = repositoryDashNotifications.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = cause });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDashNotificationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryDashNotifications.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10660", UserManager.Instance.User.Language)
            });
        }
    }
}