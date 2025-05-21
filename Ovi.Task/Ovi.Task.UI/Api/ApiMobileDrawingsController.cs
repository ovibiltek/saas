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
    public class ApiMobileDrawingsController : ApiController
    {
        private RepositoryMobileDrawings repositoryMobileDrawings;

        public ApiMobileDrawingsController()
        {
            repositoryMobileDrawings = new RepositoryMobileDrawings();
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
                        data = RepositoryShared<TMMOBILEDRAWINGS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryMobileDrawings.List(gridRequest);
                        total = RepositoryShared<TMMOBILEDRAWINGS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMobileDrawingsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMOBILEDRAWINGS nMobileDrawing)
        {
            repositoryMobileDrawings.SaveOrUpdate(nMobileDrawing);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20244", UserManager.Instance.User.Language),
                r = nMobileDrawing
            });
        }

        [HttpPost]
        public string Get(TMMOBILEDRAWINGS mobileDrawing)
        {
            try
            {
                var action = repositoryMobileDrawings.Get(mobileDrawing);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = action
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMobileDrawingsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

    }
}