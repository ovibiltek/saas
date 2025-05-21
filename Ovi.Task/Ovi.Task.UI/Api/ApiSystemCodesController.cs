using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiSystemCodesController : ApiController
    {
        private RepositorySystemCodes repositorySystemCodes;

        public ApiSystemCodesController()
        {
            repositorySystemCodes = new RepositorySystemCodes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                if (gridRequest.sort == null)
                {
                    gridRequest.sort = new List<GridSort>
                    {
                        new GridSort
                        {
                            Field = "SYC_ORDER",
                            Dir = "asc"
                        }
                    };
                }

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSYSCODES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositorySystemCodes.List(gridRequest);
                        total = RepositoryShared<TMSYSCODES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSystemCodesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSYSCODES nSysCode)
        {
            repositorySystemCodes.SaveOrUpdate(nSysCode, nSysCode.SYC_SQLIDENTITY == 0);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10157", UserManager.Instance.User.Language),
                r = nSysCode
            });
        }

        [HttpPost]
        public string Get(TMSYSCODES p)
        {
            try
            {
                var syscode = repositorySystemCodes.Get(p);
                return JsonConvert.SerializeObject(new { status = 200, data = syscode });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSystemCodesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TMSYSCODES p)
        {
            repositorySystemCodes.DeleteByEntity(p);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10158", UserManager.Instance.User.Language)
            });
        }
    }
}