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
    public class ApiPeriodicTasksController : ApiController
    {
        private RepositoryPeriodicTasks repositoryPeriodicTasks;

        public ApiPeriodicTasksController()
        {
            repositoryPeriodicTasks = new RepositoryPeriodicTasks();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PTK_ORGANIZATION");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPERIODICTASKS>.Count(gridRequest)
                    : repositoryPeriodicTasks.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPeriodicTasksController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListPreview(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "PTP_ORGANIZATION");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPERIODICTASKSPREVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryPeriodicTasks.ListPreview(gridRequest);
                        total = RepositoryShared<TMPERIODICTASKSPREVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPeriodicTasksController", "ListPreview");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPERIODICTASKS nPeriodicTask)
        {
            repositoryPeriodicTasks.SaveOrUpdate(nPeriodicTask, nPeriodicTask.PTK_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10108", UserManager.Instance.User.Language),
                r = nPeriodicTask
            });
        }

        [HttpPost]
        [Transaction]
        public string Generate(GENERATEPERIODICTASKSPARAMS periodicTaskParams)
        {
            repositoryPeriodicTasks.Generate(periodicTaskParams);
            return JsonConvert.SerializeObject(new { status = 200 });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var periodicTask = repositoryPeriodicTasks.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = periodicTask });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPeriodicTasksController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryPeriodicTasks.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10109", UserManager.Instance.User.Language)
            });
        }
    }
}