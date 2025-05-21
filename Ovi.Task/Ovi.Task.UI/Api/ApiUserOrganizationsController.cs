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
    public class ApiUserOrganizationsController : ApiController
    {
        private RepositoryUserOrganizations repositoryUserOrganizations;

        public ApiUserOrganizationsController()
        {
            repositoryUserOrganizations = new RepositoryUserOrganizations();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMUSERORGANIZATIONS>.Count(gridRequest)
                    : repositoryUserOrganizations.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserOrganizationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUSERORGANIZATIONS nOrg)
        {
            repositoryUserOrganizations.SaveOrUpdate(nOrg);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10306", UserManager.Instance.User.Language),
                r = nOrg
            });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var userorg = repositoryUserOrganizations.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = userorg });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserOrganizationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryUserOrganizations.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10307", UserManager.Instance.User.Language) });
        }
    }
}