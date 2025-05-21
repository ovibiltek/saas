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
    public class ApiSystemGroupCodesController : ApiController
    {
        private RepositorySystemGroupCodes repositorySystemGroupCodes;

        public ApiSystemGroupCodesController()
        {
            repositorySystemGroupCodes = new RepositorySystemGroupCodes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMSYSTEMGROUPCODES>.Count(gridRequest);
                        break;

                    default:
                        data = repositorySystemGroupCodes.List(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "RepositorySystemGroupCodes", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSYSTEMGROUPCODES nSysGroupCode)
        {
            repositorySystemGroupCodes.SaveOrUpdate(nSysGroupCode, nSysGroupCode.SGC_SQLIDENTITY == 0);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10672", UserManager.Instance.User.Language),
                r = nSysGroupCode
            });
        }

        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var sysgroupcode = repositorySystemGroupCodes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = sysgroupcode });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSystemGroupCodesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] string id)
        {
            repositorySystemGroupCodes.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10673", UserManager.Instance.User.Language)
            });
        }
    }
}