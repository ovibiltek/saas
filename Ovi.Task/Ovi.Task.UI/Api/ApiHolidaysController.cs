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
    public class ApiHolidaysController : ApiController
    {
        public class GetMonthlyHolidaysParam
        {
            public int Year { get; set; }

            public int Month { get; set; }
        }

        private RepositoryHolidays repositoryHolidays;

        public ApiHolidaysController()
        {
            repositoryHolidays = new RepositoryHolidays();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMHOLIDAYS>.Count(gridRequest)
                    : repositoryHolidays.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHolidaysController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMHOLIDAYS nHoliday)
        {
            repositoryHolidays.SaveOrUpdate(nHoliday);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10151", UserManager.Instance.User.Language), r = nHoliday });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var holiday = repositoryHolidays.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = holiday });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHolidaysController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetMonthlyHolidays(GetMonthlyHolidaysParam getMonthlyHolidaysParam)
        {
            try
            {
                var holidays = repositoryHolidays.ListMonthlyHolidays(getMonthlyHolidaysParam.Year, getMonthlyHolidaysParam.Month);
                return JsonConvert.SerializeObject(new { status = 200, data = holidays });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHolidaysController", "GetMonthlyHolidays");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryHolidays.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10152", UserManager.Instance.User.Language) });
        }
    }
}