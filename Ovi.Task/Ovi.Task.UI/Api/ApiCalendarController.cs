using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
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
    public class ApiCalendarController : ApiController
    {
        public class Tsko
        {
            public string Unit { get; set; }

            public string User { get; set; }

            public long Id { get; set; }

            public long Line { get; set; }

            public string Date { get; set; }
        }

        public class GetItemsParams
        {
            public int Year { get; set; }

            public int Week { get; set; }

            public string Department { get; set; }

            public string Type { get; set; }

            public string[] RelatedArr { get; set; }
        }

        public class GetCustomerItemParams
        {
            public int Year { get; set; }

            public int Week { get; set; }
        }

        public class GetDailyPlanParams
        {
            public DateTime Date { get; set; }

            public char Type { get; set; }
        }

        public class GetMonthlyItemsParams
        {
            public int Year { get; set; }

            public int Month { get; set; }

            public string User { get; set; }
        }

        private RepositoryCalendar repositoryCalendar;

        public ApiCalendarController()
        {
            repositoryCalendar = new RepositoryCalendar();
        }

        [HttpPost]
        public string GetItems(GetItemsParams getItemsParams)
        {
            try
            {
                var calendarItems = repositoryCalendar.ListByType(
                    getItemsParams.Year, 
                    getItemsParams.Week, 
                    getItemsParams.Type, 
                    UserManager.Instance.User.Code, 
                    getItemsParams.RelatedArr);
                var tradeusers = repositoryCalendar.GetWeeklyTradeUsers(getItemsParams.Year, getItemsParams.Week);
                return JsonConvert.SerializeObject(new { status = 200, data = calendarItems, tradeusers = tradeusers },
                    Formatting.None, 
                    new JsonSerializerSettings { NullValueHandling = NullValueHandling.Include });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "GetItems");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetDailyPlan(GetDailyPlanParams getDailyPlanParams)
        {
            try
            {
                var dailyItems = repositoryCalendar.GetDailyPlan(getDailyPlanParams.Type, getDailyPlanParams.Date);
                return JsonConvert.SerializeObject(new { status = 200, data = dailyItems });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "GetDailyPlan");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetCustomerItems(GetCustomerItemParams getCustomerItemParams)
        {
            try
            {
                var repositoryUserOrganizations = new RepositoryUserOrganizations();
                var organizations = repositoryUserOrganizations.ListByUser(UserManager.Instance.User.Code);
                var tradeusers = repositoryCalendar.GetWeeklyTradeUsers(getCustomerItemParams.Year, getCustomerItemParams.Week);
                var calendarItems = repositoryCalendar.ListByCustomer(getCustomerItemParams.Year, getCustomerItemParams.Week, UserManager.Instance.User.Customer, organizations);
                return JsonConvert.SerializeObject(new { status = 200, data = calendarItems, tradeusers = tradeusers });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "GetCustomerItems");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetMonthlyItems(GetMonthlyItemsParams getMonthlyItemsParams)
        {
            try
            {
                var calendarItems = repositoryCalendar.ListMonthlyTasks(UserManager.Instance.User.Code, getMonthlyItemsParams.User, getMonthlyItemsParams.Year, getMonthlyItemsParams.Month);
                return JsonConvert.SerializeObject(new { status = 200, data = calendarItems });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "GetMonthlyItems");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetMonthlyHours(GetMonthlyItemsParams getMonthlyItemsParams)
        {
            try
            {
                var repositoryUserOrganizations = new RepositoryUserOrganizations();
                var organizations = repositoryUserOrganizations.ListByUser(UserManager.Instance.User.Code);
                var calendarItems = repositoryCalendar.ListOnlyAssignedTasksActualOrPlannedByUYM(getMonthlyItemsParams.User, getMonthlyItemsParams.Year, getMonthlyItemsParams.Month, organizations);

                return JsonConvert.SerializeObject(new { status = 200, data = calendarItems });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "GetMonthlyItems");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpGet]
        public string GetAgendaItems()
        {
            try
            {
                var repositoryUserOrganizations = new RepositoryUserOrganizations();
                var organizations = repositoryUserOrganizations.ListByUser(UserManager.Instance.User.Code);
                var agendaItems = repositoryCalendar.ListByUser(UserManager.Instance.User.Code, DateTime.Now.Date, organizations);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = agendaItems
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "GetAgendaItems");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string MoveTask(Tsko tsk)
        {
            var repositoryTasks = new RepositoryTasks();
            var tasko = repositoryTasks.Get(tsk.Id);

            if (repositoryCalendar.MoveTask(tsk.Unit, tsk.User, tsk.Id, tsk.Line, tsk.Date))
            {
                var taskn = repositoryTasks.Get(tsk.Id);
            }

            return JsonConvert.SerializeObject(new { status = 200, data = "OK" });
        }

        [HttpPost]
        public string ListUnplannedTasks(GridRequest gridRequest)
        {
            try
            {
                gridRequest =GridRequestHelper.BuildFunctionFilter(GridRequestHelper.Filter(gridRequest, "TSK_CUSTOMER", "TSK_ORGANIZATION"));
                var repositoryUnplannedTasks = new RepositoryUnplannedTasks();
                var lstunplannedtasks = repositoryUnplannedTasks.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = lstunplannedtasks });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCalendarController", "ListUnplannedTasks");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}