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
    public class ApiExchRatesController : ApiController
    {
        private RepositoryExchRates repositoryExchRates;

        public ApiExchRatesController()
        {
            repositoryExchRates = new RepositoryExchRates();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMEXCHRATES>.Count(gridRequest)
                    : repositoryExchRates.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiExchRatesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMEXCHRATES nExchRate)
        {
            repositoryExchRates.SaveOrUpdate(nExchRate);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10082", UserManager.Instance.User.Language),
                r = nExchRate
            });
        }

        [HttpPost]
        public string QueryExch(TMEXCHRATES exchRate)
        {
            try
            {
                var e = repositoryExchRates.QueryExchRate(exchRate);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = e
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiExchRatesController", "QueryExch");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var exchrate = repositoryExchRates.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = exchrate });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiExchRatesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryExchRates.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10083", UserManager.Instance.User.Language)
            });
        }
    }
}