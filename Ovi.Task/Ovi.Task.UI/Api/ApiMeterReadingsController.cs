using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiMeterReadingsController : ApiController
    {
        private RepositoryMeterReadings repositoryMeterReadings;

        public ApiMeterReadingsController()
        {
            repositoryMeterReadings = new RepositoryMeterReadings();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMMETERREADINGS>.Count(gridRequest)
                    : repositoryMeterReadings.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (TmsException te)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = te.Message });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMeterReadingsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                if (UserManager.Instance.User.Customer != null)
                {
                    if (gridRequest.filter == null)
                    {
                        gridRequest.filter = new GridFilters { Filters = new List<GridFilter>() };
                    }

                    gridRequest.filter.Filters.Add(new GridFilter { Field = "REA_TSKCUSTOMER", Value = UserManager.Instance.User.Customer, Operator = "eq", Logic = "and" });
                }

                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMMETERREADINGSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryMeterReadings.ListView(gridRequest);
                        total = RepositoryShared<TMMETERREADINGSVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMeterReadingsController", "ListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        public string ListCompensation(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                if (UserManager.Instance.User.Customer != null)
                {
                    if (gridRequest.filter == null)
                    {
                        gridRequest.filter = new GridFilters { Filters = new List<GridFilter>() };
                    }

                    gridRequest.filter.Filters.Add(new GridFilter { Field = "REA_CUSCODE", Value = UserManager.Instance.User.Customer, Operator = "eq", Logic = "and" });
                }

                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMCOMPENSATIONVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryMeterReadings.ListCompensation(gridRequest);
                        total = RepositoryShared<TMCOMPENSATIONVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMeterReadingsController", "ListCompensation");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMETERREADINGS nMeterReadings)
        {
            repositoryMeterReadings.SaveOrUpdate(nMeterReadings);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10132", UserManager.Instance.User.Language), r = nMeterReadings });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var meterReadings = repositoryMeterReadings.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = meterReadings });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMeterReadingsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryMeterReadings.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10133", UserManager.Instance.User.Language) });
        }
    }
}