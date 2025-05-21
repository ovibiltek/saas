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
    public class ApiTimekeepingController : ApiController
    {
        private RepositoryTimekeeping repositoryTimekeeping;

        public ApiTimekeepingController()
        {
            repositoryTimekeeping = new RepositoryTimekeeping();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "TKP_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTIMEKEEPING>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTimekeeping.List(gridRequest);
                        total = RepositoryShared<TMTIMEKEEPING>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTimekeepingController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TimekeepingModel mTimekeeping)
        {
            repositoryTimekeeping.SaveOrUpdate(mTimekeeping.Timekeeping);

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("TIMEKEEPING", mTimekeeping.Timekeeping.TKP_ID.ToString(), mTimekeeping.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10185", UserManager.Instance.User.Language),
                r = mTimekeeping
            });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var timekeeping = repositoryTimekeeping.Get(id);
                var timekeepingstatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = timekeeping.TKP_STATUS, STA_ENTITY = "TIMEKEEPING" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = timekeeping,
                    stat = timekeepingstatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTimekeepingController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryTimekeeping.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10186", UserManager.Instance.User.Language) });
        }
    }
}