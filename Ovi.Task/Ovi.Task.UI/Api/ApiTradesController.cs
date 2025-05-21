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
    public class ApiTradesController : ApiController
    {
        private RepositoryTrades repositoryTrades;

        public ApiTradesController()
        {
            repositoryTrades = new RepositoryTrades();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {

                gridRequest =GridRequestHelper.BuildFunctionFilter(GridRequestHelper.Filter(gridRequest, null, "TRD_ORGANIZATION"));
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMTRADES>.Count(gridRequest)
                    : repositoryTrades.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTradesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTRADES nTrade)
        {
            repositoryTrades.SaveOrUpdate(nTrade);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10116", UserManager.Instance.User.Language),
                r = nTrade
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var trade = repositoryTrades.Get(id);
                return JsonConvert.SerializeObject(new 
                { 
                    status = 200,
                    data = trade,
                    regions = new RepositoryRegions().GetRegions(trade.TRD_REGION),
                    tasktypes = new RepositorySystemCodes().GetCodes("TASKTYPE", trade.TRD_TASKTYPES)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTradesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryTrades.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10117", UserManager.Instance.User.Language)
            });
        }
    }
}