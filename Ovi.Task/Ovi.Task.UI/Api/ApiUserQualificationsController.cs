using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiUserQualificationsController : ApiController
    {
        private RepositoryUserQualifications repositoryUserQualifications;

        public ApiUserQualificationsController()
        {
            repositoryUserQualifications = new RepositoryUserQualifications(); ;
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
                        data = RepositoryShared<TMUSERQUALIFICATIONS>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryUserQualifications.List(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserQualificationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUSERQUALIFICATIONS nUserQualifications)
        {
            repositoryUserQualifications.SaveOrUpdate(nUserQualifications);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10670", UserManager.Instance.User.Language),
                r = nUserQualifications
            });
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var userqualifications = repositoryUserQualifications.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = userqualifications });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserQualificationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositoryUserQualifications.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10671", UserManager.Instance.User.Language) });
        }
    }
}