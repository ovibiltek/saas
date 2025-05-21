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
    public class ApiUserAnnualLeavesController : ApiController
    {
        private RepositoryUserAnnualLeaves repositoryUserAnnualLeaves;

        public ApiUserAnnualLeavesController()
        {
            repositoryUserAnnualLeaves = new RepositoryUserAnnualLeaves();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMUSERANNUALLEAVES>.Count(gridRequest)
                    : repositoryUserAnnualLeaves.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserAnnualLeavesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUSERANNUALLEAVES nAnnualLeave)
        {
            repositoryUserAnnualLeaves.SaveOrUpdate(nAnnualLeave);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10189", UserManager.Instance.User.Language),
                r = nAnnualLeave
            });
        }

        [HttpPost]
        public string GetByUser([FromBody]string user)
        {
            try
            {
                var annualLeaveSummary = repositoryUserAnnualLeaves.GetByUser(user);
                return JsonConvert.SerializeObject(new { status = 200, data = annualLeaveSummary });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserAnnualLeavesController", "GetByUser");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var exc = repositoryUserAnnualLeaves.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = exc });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserAnnualLeavesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryUserAnnualLeaves.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10190", UserManager.Instance.User.Language)
            });
        }
    }
}