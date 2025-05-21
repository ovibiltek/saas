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
    public class ApiMobilePhonePrefixController : ApiController
    {
        private RepositoryMobilePhonePrefix repositoryMobilePhonePrefix;

        public ApiMobilePhonePrefixController()
        {
            repositoryMobilePhonePrefix = new RepositoryMobilePhonePrefix();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMMOBILEPHONEPREFIX>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryMobilePhonePrefix.List(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMobilePhonePrefixController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

    }
}