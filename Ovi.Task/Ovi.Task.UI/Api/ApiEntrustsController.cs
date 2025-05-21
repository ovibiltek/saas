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
    public class ApiEntrustsController:ApiController
    {
        private RepositoryEntrusts repositoryEntrusts;

        public ApiEntrustsController()
        {
            repositoryEntrusts = new RepositoryEntrusts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "ETR_USER", "ETR_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMENTRUSTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryEntrusts.List(gridRequest);
                        total = RepositoryShared<TMENTRUSTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMENTRUSTS nEntrusts)
        {
            repositoryEntrusts.SaveOrUpdate(nEntrusts, nEntrusts.ETR_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10464", UserManager.Instance.User.Language),
                r = nEntrusts
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var entrust = repositoryEntrusts.Get(id);
                var entruststatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = entrust.ETR_STATUS, STA_ENTITY = "ENTRUST" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = entrust,
                    stat = entruststatus
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryEntrusts.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10465", UserManager.Instance.User.Language)
            });
        }


    }
}