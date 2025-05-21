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
    public class ApiDayOffRequestsController : ApiController
    {
        private RepositoryDayOffRequests repositoryDayOffRequests;

        public ApiDayOffRequestsController()
        {
            repositoryDayOffRequests = new RepositoryDayOffRequests();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "DOR_ORGANIZATION");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMDAYOFFREQUESTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryDayOffRequests.List(gridRequest);
                        total = RepositoryShared<TMDAYOFFREQUESTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDayOffRequestsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string CalculateLeaveDuration(LeaveDurationParameters leaveDurationParameters)
        {
            try
            {
                var result = repositoryDayOffRequests.CalculateLeaveDuration(leaveDurationParameters);
                return JsonConvert.SerializeObject(new { status = 200, data = result });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDayOffRequestsController", "CalculateLeaveDuration");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(DayOffRequestModel mDayOffRequest)
        {
            repositoryDayOffRequests.SaveOrUpdate(mDayOffRequest.DayOffRequest);
            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("DAYOFFREQUEST", mDayOffRequest.DayOffRequest.DOR_ID.ToString(), mDayOffRequest.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10153", UserManager.Instance.User.Language),
                r = mDayOffRequest
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var dayoffrequest = repositoryDayOffRequests.Get(id);
                var dorstatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = dayoffrequest.DOR_STATUS, STA_ENTITY = dayoffrequest.DOR_STATUSENTITY });
                return JsonConvert.SerializeObject(new { status = 200, data = dayoffrequest, stat = dorstatus });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDayOffRequestsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryDayOffRequests.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10154", UserManager.Instance.User.Language) });
        }
    }
}