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
    public class ApiScreensController : ApiController
    {
        private RepositoryScreens repositoryScreens;

        public ApiScreensController()
        {
            repositoryScreens = new RepositoryScreens();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSCREENS>.Count(gridRequest)
                    : repositoryScreens.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiScreensController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSCREENS nScreen)
        {
            repositoryScreens.SaveOrUpdate(nScreen);

            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMSCREENS",
                DES_PROPERTY = "SCR_DESC",
                DES_CODE = nScreen.SCR_CODE,
                DES_TEXT = nScreen.SCR_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10029", UserManager.Instance.User.Language),
                r = nScreen
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var screen = repositoryScreens.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = screen });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiScreensController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryScreens.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10030", UserManager.Instance.User.Language)
            });
        }

         [HttpPost]
        public string GetGuide([FromBody] string id)
        {
            try
            {
                var repositoryScreenGuide = new RepositoryScreenGuides();
                var screenguide = repositoryScreenGuide.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = screenguide });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiScreensController", "GetGuide");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string DelGuide([FromBody] string id)
        {
            var repositoryScreenGuide = new RepositoryScreenGuides();
            repositoryScreenGuide.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10030", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveGuide(TMSCREENGUIDES nGuide)
        {
            var repositoryScreenGuide = new RepositoryScreenGuides();
            repositoryScreenGuide.SaveOrUpdate(nGuide);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10029", UserManager.Instance.User.Language),
                r = nGuide
            });
        }
    }
}