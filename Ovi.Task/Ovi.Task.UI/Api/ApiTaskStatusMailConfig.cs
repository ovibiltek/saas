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
    public class ApiTaskStatusMailConfigController : ApiController
    {
        private RepositoryTaskStatusMailConfig repositoryTaskStatusMailConfig;

        public ApiTaskStatusMailConfigController()
        {
            repositoryTaskStatusMailConfig = new RepositoryTaskStatusMailConfig();
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
                        data = RepositoryShared<TMTSKSTATUSMAILCONFIG>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskStatusMailConfig.List(gridRequest);
                        total = RepositoryShared<TMTSKSTATUSMAILCONFIG>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskStatusMailConfigController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTSKSTATUSMAILCONFIG nAction)
        {
            repositoryTaskStatusMailConfig.SaveOrUpdate(nAction);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10661", UserManager.Instance.User.Language),
                r = nAction
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                if (id == 0)
                    return JsonConvert.SerializeObject(new {status = 200, data = string.Empty});

                var repositoryCategories = new RepositoryCategories();
                var config = repositoryTaskStatusMailConfig.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = config,
                    IncludedCategories = !string.IsNullOrEmpty(config.TSM_INCCATEGORIES) ? repositoryCategories.GetCategories(config.TSM_INCCATEGORIES) : null,
                    ExcludedCategories = !string.IsNullOrEmpty(config.TSM_EXCCATEGORIES) ? repositoryCategories.GetCategories(config.TSM_EXCCATEGORIES) : null,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskStatusMailConfigController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryTaskStatusMailConfig.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10662", UserManager.Instance.User.Language)
            });
        }
    }
}