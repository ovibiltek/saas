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
    public class ApiReportingController : ApiController
    {
        private RepositoryReporting repositoryReporting;

        public ApiReportingController()
        {
            repositoryReporting = new RepositoryReporting();
        }
      

        [HttpPost]
        public string List(GridRequest gridRequest)
        {

            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "REP_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMREPORTING>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryReporting.List(gridRequest);
                        total = RepositoryShared<TMREPORTING>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApireportingController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {

            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "REP_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMREPORTINGVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryReporting.ListView(gridRequest);
                        total = RepositoryShared<TMREPORTINGVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApireportingController", "ListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(ReportingModel mReporting)
        {
            repositoryReporting.SaveOrUpdate(mReporting.Reporting);

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("REPORTING", mReporting.Reporting.REP_ID.ToString(), mReporting.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10427", UserManager.Instance.User.Language),
                r = mReporting
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var reporting = repositoryReporting.Get(id);
                var reportingstatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = reporting.REP_STATUS, STA_ENTITY = "REPORTING" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = reporting,
                    stat = reportingstatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApireportingController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryReporting.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10428", UserManager.Instance.User.Language)
            });
        }

    }
}