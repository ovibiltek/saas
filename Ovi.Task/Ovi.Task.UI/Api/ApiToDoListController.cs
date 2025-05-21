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
    public class ApiToDoListController : ApiController
    {
        private RepositoryToDoList repositoryToDoList;

        public ApiToDoListController()
        {
            repositoryToDoList = new RepositoryToDoList();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = repositoryToDoList.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiToDoListController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListCount(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = repositoryToDoList.ListCount(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiToDoListController", "ListCount");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Query(TodoQuery que)
        {
            try
            {
                var data = repositoryToDoList.Query(que);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiToDoListController", "Query");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTODOLIST nToDoList)
        {
            var item = repositoryToDoList.SaveOrUpdate(nToDoList);

            var repositoryNotifications = new RepositoryNotifications();
            repositoryNotifications.SaveOrUpdate(new TMNOTIFICATIONS
            {
                NOT_TYPE = "NEWTODO",
                NOT_CREATED = DateTime.Now,
                NOT_CREATEDBY = UserManager.Instance.User.Code,
                NOT_SUBJECT = "TODO",
                NOT_DESC = string.Format("{0} - {1}", item.TOD_ID, item.TOD_TEXT),
                NOT_READ = '-',
                NOT_SOURCE = item.TOD_ID.ToString()
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10044", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string Update(TMTODOLIST nToDoList)
        {
            var oToDoList = repositoryToDoList.Get(nToDoList.TOD_ID);

            oToDoList.TOD_COMPLETED = nToDoList.TOD_COMPLETED;
            oToDoList.TOD_COMPLETEDBY = nToDoList.TOD_COMPLETEDBY;

            repositoryToDoList.SaveOrUpdate(oToDoList);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10045", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryToDoList.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10046", UserManager.Instance.User.Language),
            });
        }
    }
}