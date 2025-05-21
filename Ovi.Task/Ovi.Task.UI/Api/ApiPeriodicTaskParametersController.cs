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
    public class ApiPeriodicTaskParametersController : ApiController
    {
        private RepositoryPeriodicTaskParameters repositoryPeriodicTaskParameters;

        public ApiPeriodicTaskParametersController()
        {
            repositoryPeriodicTaskParameters = new RepositoryPeriodicTaskParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMPERIODICTASKPARAMETERS>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryPeriodicTaskParameters.List(gridRequest);
                    total = RepositoryShared<TMPERIODICTASKPARAMETERS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPeriodicTaskParametersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPERIODICTASKPARAMETERS nPeriodicTaskParameter)
        {
            repositoryPeriodicTaskParameters.SaveOrUpdate(nPeriodicTaskParameter);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10110", UserManager.Instance.User.Language), r = nPeriodicTaskParameter });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var ptp = repositoryPeriodicTaskParameters.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = ptp });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPeriodicTaskParametersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPeriodicTaskParameters.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10111", UserManager.Instance.User.Language) });
        }
    }
}