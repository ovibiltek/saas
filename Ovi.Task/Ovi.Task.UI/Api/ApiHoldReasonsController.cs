using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class ListByUserGroupParam
    {
        public string UserGroup { get; set; }

        public string SelectedHoldReason { get; set; }

        public GridRequest GridRequest { get; set; }
    }

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiHoldReasonsController : ApiController
    {
        private RepositoryHoldReasons repositoryHoldReasons;
        private RepositoryUserGroupHoldReasons repositoryUserGroupHoldReasons;

        public ApiHoldReasonsController()
        {
            repositoryHoldReasons = new RepositoryHoldReasons();
            repositoryUserGroupHoldReasons = new RepositoryUserGroupHoldReasons();
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
                        data = RepositoryShared<TMHOLDREASONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryHoldReasons.List(gridRequest);
                        total = RepositoryShared<TMHOLDREASONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHoldReasonsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListByUserGroup(ListByUserGroupParam listByUserGroupParam)
        {
            try
            {
                var holdreasonsbyusergroup = repositoryUserGroupHoldReasons.GetByUserGroup(new[] { listByUserGroupParam.UserGroup, "*" }).Select(f => f.UGH_HOLDREASON);
                var holdreasons = repositoryHoldReasons.List(GridRequestHelper.BuildFunctionFilter(listByUserGroupParam.GridRequest));
                var data = (from h in holdreasons
                            where holdreasonsbyusergroup.Contains(h.HDR_CODE) && h.HDR_TMS == '+'
                            select h).ToList();

                if (!string.IsNullOrEmpty(listByUserGroupParam.SelectedHoldReason))
                {
                    var selectedholdreason = repositoryHoldReasons.Get(listByUserGroupParam.SelectedHoldReason);
                    if (data.All(x => x.HDR_CODE != listByUserGroupParam.SelectedHoldReason))
                    {
                        data.Add(selectedholdreason);
                    }
                }
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHoldReasonsController", "ListByUserGroup");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListHoldReasonView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMHOLDREASONHISTORYVIEW>.Count(gridRequest)
                    : repositoryHoldReasons.ListHoldReasonView(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHoldReasonsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListHoldPerformanceView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMWAITINGPERFORMANCEREPORTVIEW>.Count(gridRequest)
                    : repositoryHoldReasons.ListHoldPerformanceView(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHoldReasonsController", "ListHoldPerformanceView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMHOLDREASONS nHoldReason)
        {
            repositoryHoldReasons.SaveOrUpdate(nHoldReason, nHoldReason.HDR_SQLIDENTITY == 0);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10130", UserManager.Instance.User.Language),
                r = nHoldReason
            });
        }

        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var holdReason = repositoryHoldReasons.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = holdReason });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHoldReasonsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] string id)
        {
            repositoryHoldReasons.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10131", UserManager.Instance.User.Language)
            });
        }
    }
}