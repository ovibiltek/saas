using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Supervision;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiSupervisionController : ApiController
    {
        private RepositorySupervision repositorySupervision;

        public ApiSupervisionController()
        {
            repositorySupervision = new RepositorySupervision();
        }
      

        [HttpPost]
        public string List(GridRequest gridRequest)
        {

            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "SPV_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSUPERVISION>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySupervision.List(gridRequest);
                        total = RepositoryShared<TMSUPERVISION>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupervisionController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {

            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "SPV_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSUPERVISIONVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySupervision.ListView(gridRequest);
                        total = RepositoryShared<TMSUPERVISIONVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupervisionController", "ListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(SupervisionModel mSupervision)
        {
            repositorySupervision.SaveOrUpdate(mSupervision.Supervision);

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("SUPERVISION", mSupervision.Supervision.SPV_ID.ToString(), mSupervision.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10422", UserManager.Instance.User.Language),
                r = mSupervision
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var supervision = repositorySupervision.Get(id);
                var supervisionstatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = supervision.SPV_STATUS, STA_ENTITY = "SUPERVISION" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = supervision,
                    stat = supervisionstatus,
                    supervisor = new RepositoryUsers().GetUsers(supervision.SPV_SUPERVISOR)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSupervisionController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositorySupervision.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10423", UserManager.Instance.User.Language)
            });
        }

    }
}