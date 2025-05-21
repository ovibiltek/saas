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
    public class ApiFunctionCodesController : ApiController
    {
        private RepositoryFunctionCodes repositoryFunctionCodes;

        public ApiFunctionCodesController()
        {
            repositoryFunctionCodes = new RepositoryFunctionCodes();
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
                        data = RepositoryShared<TMFUNCODES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryFunctionCodes.List(gridRequest);
                        total = RepositoryShared<TMFUNCODES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFunctionCodes", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMFUNCODES nFunCode)
        {
            repositoryFunctionCodes.SaveOrUpdate(nFunCode, nFunCode.FUN_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("30108", UserManager.Instance.User.Language),
                r = nFunCode
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                if (id == null)
                {
                    return JsonConvert.SerializeObject(new { status = 200, data = string.Empty });
                }

                var funcode = repositoryFunctionCodes.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = funcode
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFunctionCodes", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryFunctionCodes.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("30109", UserManager.Instance.User.Language)
            });
        }
    }
}