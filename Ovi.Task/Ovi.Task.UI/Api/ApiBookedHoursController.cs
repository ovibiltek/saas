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
    public class ApiBookedHoursController : ApiController
    {
        private RepositoryBookedHours repositoryBookedHours;

        public class UpdateTimeDetail
        {
            public int Start { get; set; }

            public int End { get; set; }

            public long Id { get; set; }
        }


        public ApiBookedHoursController()
        {
            repositoryBookedHours = new RepositoryBookedHours();
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
                        data = RepositoryShared<TMBOOKEDHOURS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryBookedHours.List(gridRequest);
                        total = RepositoryShared<TMBOOKEDHOURS>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (TmsException te)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = te.Message });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBookedHoursController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "BOO_CUSTOMER", "BOO_TSKORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMBOOKEDHOURSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryBookedHours.ListView(gridRequest);
                        total = RepositoryShared<TMBOOKEDHOURSVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBookedHoursController", "ListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string BookedHoursSummary([FromBody]long id)
        {
            try
            {
                var data = repositoryBookedHours.GetSummary(id);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBookedHoursController", "BookedHoursSummary");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMBOOKEDHOURS nBookedHours)
        {
            repositoryBookedHours.SaveOrUpdate(nBookedHours);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10056", UserManager.Instance.User.Language), r = nBookedHours });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var bookedHours = repositoryBookedHours.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = bookedHours });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBookedHoursController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryBookedHours.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10057", UserManager.Instance.User.Language)
            });
        }


        [HttpPost]
        [Transaction]
        public string Update(UpdateTimeDetail nNewTimes)
        {

                var bookedHours = repositoryBookedHours.Get(nNewTimes.Id);
                bookedHours.BOO_START = nNewTimes.Start;
                bookedHours.BOO_END = nNewTimes.End;
                bookedHours.BOO_UPDATED = DateTime.Now;
                bookedHours.BOO_UPDATEDBY = UserManager.Instance.User.Code;
                repositoryBookedHours.SaveOrUpdate(bookedHours);

                return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10456", UserManager.Instance.User.Language) });
                
        }
    }
}