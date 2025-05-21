using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
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
    public class ApiUserGridConfigurationController : ApiController
    {
        private RepositoryUserGridConfiguration repositoryUserGridConfiguration;

        public ApiUserGridConfigurationController()
        {
            repositoryUserGridConfiguration = new RepositoryUserGridConfiguration();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMUSERGRIDCONFIGURATION>.Count(gridRequest)
                    : repositoryUserGridConfiguration.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (TmsException te)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = te.Message });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserGridConfigurationController", "DelRec");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(UserGridConfiguration userGridConfiguration)
        {
            repositoryUserGridConfiguration.SaveCustom(userGridConfiguration);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20017", UserManager.Instance.User.Language)
            });
        }
    }
}