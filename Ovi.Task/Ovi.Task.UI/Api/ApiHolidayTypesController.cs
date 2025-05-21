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
    public class ApiHolidayTypesController : ApiController
    {
        private RepositoryHolidayTypes repositoryHolidayTypes;

        public ApiHolidayTypesController()
        {
            repositoryHolidayTypes = new RepositoryHolidayTypes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMHOLIDAYTYPES>.Count(gridRequest)
                    : repositoryHolidayTypes.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHolidayTypesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMHOLIDAYTYPES nHolidayType)
        {
            repositoryHolidayTypes.SaveOrUpdate(nHolidayType, nHolidayType.HOT_SQLIDENTITY == 0);
            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMHOLIDAYTYPES",
                DES_PROPERTY = "HOT_DESC",
                DES_CODE = nHolidayType.HOT_CODE,
                DES_TEXT = nHolidayType.HOT_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10149", UserManager.Instance.User.Language),
                r = nHolidayType
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var holidayType = repositoryHolidayTypes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = holidayType });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiHolidayTypesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryHolidayTypes.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10150", UserManager.Instance.User.Language) });
        }
    }
}