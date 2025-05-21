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
    public class ApiMiscCostTypesController : ApiController
    {
        private RepositoryMiscCostTypes repositoryMiscCostTypes;

        public ApiMiscCostTypesController()
        {
            repositoryMiscCostTypes = new RepositoryMiscCostTypes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMMISCCOSTTYPES>.Count(gridRequest)
                    : repositoryMiscCostTypes.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMiscCostTypesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMISCCOSTTYPES nMiscCostType)
        {
            repositoryMiscCostTypes.SaveOrUpdate(nMiscCostType);

            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMMISCCOSTTYPES",
                DES_PROPERTY = "MCT_DESC",
                DES_CODE = nMiscCostType.MCT_CODE,
                DES_TEXT = nMiscCostType.MCT_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10121", UserManager.Instance.User.Language),
                r = nMiscCostType
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var miscCostType = repositoryMiscCostTypes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = miscCostType });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMiscCostTypesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryMiscCostTypes.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10122", UserManager.Instance.User.Language)
            });
        }
    }
}