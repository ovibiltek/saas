using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.CustomFields;
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
    public class ApiCustomFieldAuthController : ApiController
    {
        private RepositoryCustomFieldAuth repositoryCustomFieldAuth;

        public ApiCustomFieldAuthController()
        {
            repositoryCustomFieldAuth = new RepositoryCustomFieldAuth();
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
                        data = RepositoryShared<TMCUSTOMFIELDAUTH>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryCustomFieldAuth.List(gridRequest);
                        total = RepositoryShared<TMCUSTOMFIELDAUTH>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldAuthController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMCUSTOMFIELDAUTHVIEW>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryCustomFieldAuth.ListView(gridRequest);
                    total = RepositoryShared<TMCUSTOMFIELDAUTHVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldAuthController", "ListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUSTOMFIELDAUTH[] p)
        {
            repositoryCustomFieldAuth.SaveList(p);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10068", UserManager.Instance.User.Language),
                r = p
            });
        }
    }
}