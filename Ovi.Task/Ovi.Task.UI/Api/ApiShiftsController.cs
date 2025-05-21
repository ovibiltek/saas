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
    public class ApiShiftsController : ApiController
    {
        private RepositoryShifts repositoryShifts;

        public ApiShiftsController()
        {
            repositoryShifts = new RepositoryShifts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSHIFTS>.Count(gridRequest)
                    : repositoryShifts.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiShiftsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSHIFTS nShift)
        {
            repositoryShifts.SaveOrUpdate(nShift, nShift.SHF_SQLIDENTITY == 0);

            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMSHIFTS",
                DES_PROPERTY = "SHF_DESCRIPTION",
                DES_CODE = string.Format("{0}", nShift.SHF_CODE),
                DES_TEXT = nShift.SHF_DESCRIPTION,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10155", UserManager.Instance.User.Language),
                r = nShift
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var shift = repositoryShifts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = shift });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiShiftsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryShifts.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10156", UserManager.Instance.User.Language) });
        }
    }
}