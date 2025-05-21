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
    public class ApiEntrustPartsController:ApiController
    {
        private RepositoryEntrustParts repositoryEntrustParts;

        public ApiEntrustPartsController()
        {
            repositoryEntrustParts = new RepositoryEntrustParts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                int total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMENTRUSTPARTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryEntrustParts.List(gridRequest);
                        total = (int)RepositoryShared<TMENTRUSTPARTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustPartsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMENTRUSTPARTS nEntrustParts)
        {
            repositoryEntrustParts.SaveOrUpdate(nEntrustParts, nEntrustParts.ENP_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10466", UserManager.Instance.User.Language),
                r = nEntrustParts
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var entrustparts = repositoryEntrustParts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = entrustparts });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustPartsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetByEntrust([FromBody]int entrustid)
        {
            try
            {
                var entrustparts = repositoryEntrustParts.GetByEntrust(entrustid);
                return JsonConvert.SerializeObject(new { status = 200, data = entrustparts });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustPartsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }



        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryEntrustParts.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10467", UserManager.Instance.User.Language) });
        }

    }
}