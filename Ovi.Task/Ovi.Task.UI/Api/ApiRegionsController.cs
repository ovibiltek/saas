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
    public class ApiRegionsController : ApiController
    {
        private RepositoryRegions repositoryRegions;

        public ApiRegionsController()
        {
            repositoryRegions = new RepositoryRegions();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMREGIONS>.Count(gridRequest)
                    : repositoryRegions.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiRegionsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMREGIONS nRegion)
        {
            repositoryRegions.SaveOrUpdate(nRegion);

            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMREGIONS",
                DES_PROPERTY = "REG_DESC",
                DES_CODE = nRegion.REG_CODE,
                DES_TEXT = nRegion.REG_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10141", UserManager.Instance.User.Language),
                r = nRegion,
                responsibleusers = new RepositoryUsers().GetUsers(nRegion.REG_RESPONSIBLE),
                reportingresponsibleusers = new RepositoryUsers().GetUsers(nRegion.REG_REPORTINGRESPONSIBLE)
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var region = repositoryRegions.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    r = region,
                    responsibleusers = new RepositoryUsers().GetUsers(region.REG_RESPONSIBLE),
                    reportingresponsibleusers = new RepositoryUsers().GetUsers(region.REG_REPORTINGRESPONSIBLE)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiRegionsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryRegions.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10142", UserManager.Instance.User.Language)
            });
        }
    }
}