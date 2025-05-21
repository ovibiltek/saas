using Newtonsoft.Json;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
using Resources.Shared.Index;
using System.Globalization;
using System.Threading;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiFirebaseNotificationController : ApiController
    {
        private RepositoryFirebaseNotifications repositoryNotifications;
        private RepositoryFirebaseNotificationTrx repositoryFirebaseNotificationTrx;
        private NotificationHelper notificationHelper;
        private RepositoryParameters repositoryParameters;

        public class SendFirebaseNotification
        {
            public List<string> Topics { get; set; }

            public string Title { get; set; }

            public string Message { get; set; }

            public string User { get; set; }

            public string Parameters { get; set; }
        }

        public ApiFirebaseNotificationController()
        {
            repositoryNotifications = new RepositoryFirebaseNotifications();
            repositoryFirebaseNotificationTrx = new RepositoryFirebaseNotificationTrx();
            repositoryParameters = new RepositoryParameters();
            notificationHelper = new NotificationHelper();
        }

        [HttpPost]
        public string UpdateNotificationsAsRead(SendFirebaseNotification firebaseNotify)
        {
            try
            {
                //Get the {language} parameter in the RouteData
                var language = (UserManager.Instance.User != null && UserManager.Instance.User.Language != null)
                    ? UserManager.Instance.User.Language.ToLower()
                    : "en";

                //Get the culture info of the language code
                var culture = CultureInfo.GetCultureInfo(language);
                SharedStrings.Culture = culture;
                var systemId = repositoryParameters.Get("SYSTEMID").PRM_VALUE;
                var result = "";
                if (firebaseNotify.Topics == null || firebaseNotify.Topics.Count <= 0)
                {
                    var topic = $"{systemId}.{UserManager.Instance.User.Code}";
                    result = notificationHelper.SendNotify(
                        systemId,
                        topic,
                        firebaseNotify.Message,
                        string.IsNullOrEmpty(firebaseNotify.Title) ? $"{UserManager.Instance.User.Description} {SharedStrings.nottitle}" : firebaseNotify.Title,
                        firebaseNotify.Parameters); // 1: Gönderdi 0: Başarısız
                    if (!string.IsNullOrEmpty(result))
                    {
                        var mFireBaseNotification = new TMFIREBASENOTIFICATIONS()
                        {
                            NOT_TOPIC = topic,
                            NOT_TITLE = firebaseNotify.Title,
                            NOT_MESSAGE = firebaseNotify.Message,
                            NOT_PARAMETERS = firebaseNotify.Parameters,
                            NOT_CREATED = DateTime.Now,
                            NOT_CREATEDBY = firebaseNotify.User
                        };

                        repositoryNotifications.SaveOrUpdate(mFireBaseNotification);

                        repositoryFirebaseNotificationTrx.Save(new TMFIREBASENOTIFICATIONTRX
                        {
                            NTX_NOTIFICATION = mFireBaseNotification.NOT_ID,
                            NTX_MSG = result,
                            NTX_DATESENT = DateTime.Now,
                            NTX_ERROR = null
                        });

                    }
                }
                else
                {
                    foreach (var topic in firebaseNotify.Topics)
                    {

                        result = notificationHelper.SendNotify(
                            systemId,
                            topic,
                            firebaseNotify.Message,
                            string.IsNullOrEmpty(firebaseNotify.Title) ? $"{UserManager.Instance.User.Description} {SharedStrings.nottitle}" : firebaseNotify.Title,
                            firebaseNotify.Parameters); // 1: Gönderdi 0: Başarısız
                        if (!string.IsNullOrEmpty(result))
                        {
                            var mFireBaseNotification = new TMFIREBASENOTIFICATIONS()
                            {
                                NOT_TOPIC = topic,
                                NOT_TITLE = firebaseNotify.Title,
                                NOT_MESSAGE = firebaseNotify.Message,
                                NOT_PARAMETERS = firebaseNotify.Parameters,
                                NOT_CREATED = DateTime.Now,
                                NOT_CREATEDBY = firebaseNotify.User
                            };

                            repositoryNotifications.SaveOrUpdate(mFireBaseNotification);

                            repositoryFirebaseNotificationTrx.Save(new TMFIREBASENOTIFICATIONTRX
                            {
                                NTX_NOTIFICATION = mFireBaseNotification.NOT_ID,
                                NTX_MSG = result,
                                NTX_DATESENT = DateTime.Now,
                                NTX_ERROR = null
                            });
                        }
                    }
                }

                return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10450", UserManager.Instance.User.Language), result = result });
            }
            catch (Exception e)
            {
                throw new TmsException(e.Message);
            }
        }
    }
}