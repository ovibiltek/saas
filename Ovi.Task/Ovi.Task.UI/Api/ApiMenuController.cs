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
    public class ApiMenuController : ApiController
    {
        private RepositoryMenu repositoryMenu;

        public ApiMenuController()
        {
            repositoryMenu = new RepositoryMenu();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lst = repositoryMenu.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = lst });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMenuController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMENU[] menulist)
        {
            repositoryMenu.SaveList(menulist);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10035", UserManager.Instance.User.Language),
                r = menulist
            });
        }
    }
}