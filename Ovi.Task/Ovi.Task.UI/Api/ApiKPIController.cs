using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;
using static Ovi.Task.Data.Repositories.RepositoryKPI;

namespace Ovi.Task.UI.Api
{
    public class KPIModel
    {
        public TMKPI kpi { get; set; }

        public TMDESCRIPTIONS[] descriptions { get; set; }
    }

    public class KPIParams
    {
        public string kpigroup { get; set; }
        public string user { get; set; }
    }

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiKPIController : ApiController
    {
        private RepositoryKPI repositoryKPI;
        private RepositoryDescriptions repositoryDescriptions;

        public ApiKPIController()
        {
            repositoryKPI = new RepositoryKPI();
            repositoryDescriptions = new RepositoryDescriptions();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMKPI>.Count(gridRequest)
                    : repositoryKPI.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiKPIController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListByUser([FromBody]string user)
        {
            var kpis = repositoryKPI.ListByUser(user);
            return JsonConvert.SerializeObject(new { status = 200, data = kpis });
        }

        [HttpPost]
        public string ListByUserAndGroup(KPIParams p)
        {
            var kpis = repositoryKPI.ListByUserAndGroup(p.user, p.kpigroup);
            return JsonConvert.SerializeObject(new { status = 200, data = kpis });
        }

        [HttpPost]
        [Transaction]
        public string Save(KPIModel nKPI)
        {
            repositoryKPI.SaveOrUpdate(nKPI.kpi, nKPI.kpi.KPI_SQLIDENTITY == 0);
            if (nKPI.descriptions != null)
            {
                repositoryDescriptions.SaveList(nKPI.descriptions);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10134", UserManager.Instance.User.Language),
                r = nKPI
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var kpi = repositoryKPI.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = kpi });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiKPIController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ValidateKPI([FromBody]string id)
        {
            try
            {
                repositoryKPI.ValidateKPI(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10136", UserManager.Instance.User.Language),
                    r = repositoryKPI.Get(id)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiKPIController", "ValidateKPI");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10086", UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetData(RepositoryKPI.KPIParams kpiprms)
        {
            try
            {
                var data = repositoryKPI.GetData(kpiprms, UserManager.Instance.User.Code);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiKPIController", "GetData");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10086", UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryKPI.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10135", UserManager.Instance.User.Language)
            });
        }
    }
}