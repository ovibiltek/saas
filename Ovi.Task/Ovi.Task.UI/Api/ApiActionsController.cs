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
    public class ApiActionsController : ApiController
    {
        private RepositoryActions repositoryActions;

        public ApiActionsController()
        {
            repositoryActions = new RepositoryActions();
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
                        data = RepositoryShared<TMACTIONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryActions.List(gridRequest);
                        total = RepositoryShared<TMACTIONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiActionsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMACTIONS nAction)
        {
            repositoryActions.SaveOrUpdate(nAction, nAction.ACT_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10064", UserManager.Instance.User.Language),
                r = nAction
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                if (id == null)
                {
                    return JsonConvert.SerializeObject(new { status = 200, data = string.Empty });
                }

                var action = repositoryActions.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = action
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiActionsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryActions.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10065", UserManager.Instance.User.Language)
            });
        }
    }
}