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
    public class ApiMessagesController : ApiController
    {
        private RepositoryMessages repositoryMessages;

        public ApiMessagesController()
        {
            repositoryMessages = new RepositoryMessages();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMMSGS>.Count(gridRequest);
                object data = repositoryMessages.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMessagesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMSGS nMsg)
        {
            repositoryMessages.SaveOrUpdate(nMsg, nMsg.MSG_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10047", UserManager.Instance.User.Language),
                r = nMsg
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var msg = repositoryMessages.Get(id);
                if (msg != null)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = new
                        {
                            msg.MSG_ID,
                            msg.MSG_CODE,
                            msg.MSG_LANG,
                            MSG_LANGDESC = new RepositoryLangs().Get(msg.MSG_LANG).LNG_DESCRIPTION,
                            msg.MSG_TEXT,
                            msg.MSG_RECORDVERSION
                        }
                    });
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = (string)null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMessagesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryMessages.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10047", UserManager.Instance.User.Language)
            });
        }
    }
}