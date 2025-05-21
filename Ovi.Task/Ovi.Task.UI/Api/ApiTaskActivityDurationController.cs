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
    public class ApiTaskActivityDurationController : ApiController
    {
        private RepositoryTaskActivityDurations repositoryTaskActivityDurations;

        public ApiTaskActivityDurationController()
        {
            repositoryTaskActivityDurations = new RepositoryTaskActivityDurations();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                object data;
                long total = 0;
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKACTIVITYDURATIONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskActivityDurations.List(gridRequest);
                        total = RepositoryShared<TMTASKACTIVITYDURATIONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityDurationController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTASKACTIVITYDURATIONS nTaskActivityDuration)
        {
            repositoryTaskActivityDurations.SaveOrUpdate(nTaskActivityDuration);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10304", UserManager.Instance.User.Language), r = nTaskActivityDuration });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var tad = repositoryTaskActivityDurations.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = tad });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCategoriesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryTaskActivityDurations.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10305", UserManager.Instance.User.Language) });
        }
    }
}