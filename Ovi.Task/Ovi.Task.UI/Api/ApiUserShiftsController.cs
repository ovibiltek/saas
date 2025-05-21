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
    public class ApiUserShiftsController : ApiController
    {
        public class GetMonthlyShiftsParam
        {
            public int Year { get; set; }

            public int Month { get; set; }

            public string User { get; set; }
        }

        private RepositoryUserShifts repositoryUserShifts;

        public ApiUserShiftsController()
        {
            repositoryUserShifts = new RepositoryUserShifts();
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
                        data = RepositoryShared<TMUSERSHIFTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryUserShifts.List(gridRequest);
                        total = RepositoryShared<TMUSERSHIFTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserShiftsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUSERSHIFTS nUserShift)
        {
            repositoryUserShifts.SaveOrUpdate(nUserShift);
            return JsonConvert.SerializeObject(new { status = 200, r = nUserShift });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var usershift = repositoryUserShifts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = usershift });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserShiftsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListMonthlyUserShifts(GetMonthlyShiftsParam getMonthlyShiftsParam)
        {
            try
            {
                var usershifts = repositoryUserShifts.ListMonthlyShifts(getMonthlyShiftsParam.Year, getMonthlyShiftsParam.Month, getMonthlyShiftsParam.User);
                return JsonConvert.SerializeObject(new { status = 200, data = usershifts });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ListMonthlyUserShifts", "ListMonthlyUserShifts");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryUserShifts.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200 });
        }
    }
}