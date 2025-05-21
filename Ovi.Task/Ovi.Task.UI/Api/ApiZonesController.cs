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
    public class ApiZonesController : ApiController
    {
        private RepositoryZones repositoryZones;

        public ApiZonesController()
        {
            repositoryZones = new RepositoryZones();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMZONES>.Count(gridRequest)
                    : repositoryZones.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiZonesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var zone = repositoryZones.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = zone });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiZonesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMZONES nZone)
        {
            repositoryZones.SaveOrUpdate(nZone, nZone.ZON_SQLIDENTITY == 0);
            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMZONES",
                DES_PROPERTY = "ZON_DESC",
                DES_CODE = nZone.ZON_CODE,
                DES_TEXT = nZone.ZON_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10143", UserManager.Instance.User.Language),
                r = nZone
            });
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryZones.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10144", UserManager.Instance.User.Language)
            });
        }
    }
}