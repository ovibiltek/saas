using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiProgressPaymentGroupCodesController : ApiController
    {
        private RepositoryProgressPaymentGroupCodes repositoryProgressPaymentGroupCodes;

        public ApiProgressPaymentGroupCodesController()
        {
            repositoryProgressPaymentGroupCodes = new RepositoryProgressPaymentGroupCodes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPSPGROUPCODES>.Count(gridRequest)
                    : repositoryProgressPaymentGroupCodes.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentGroupCodesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPSPGROUPCODES nPSPGroupCode)
        {
            repositoryProgressPaymentGroupCodes.SaveOrUpdate(nPSPGroupCode, nPSPGroupCode.PSG_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10665", UserManager.Instance.User.Language),
                r = nPSPGroupCode
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var pspGroupCode = repositoryProgressPaymentGroupCodes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pspGroupCode });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentGroupCodesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryProgressPaymentGroupCodes.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10666", UserManager.Instance.User.Language) });
        }
    }
}