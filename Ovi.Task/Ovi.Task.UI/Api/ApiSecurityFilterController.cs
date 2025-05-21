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
    public class ApiSecurityFilterController : ApiController
    {
        private RepositorySecurityFilter repositorySecurityFilter;

        public ApiSecurityFilterController()
        {
            repositorySecurityFilter = new RepositorySecurityFilter();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSECURITYFILTERS>.Count(gridRequest)
                    : repositorySecurityFilter.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSecurityFilterController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSECURITYFILTERS nSecurityFilter)
        {
            repositorySecurityFilter.SaveOrUpdate(nSecurityFilter, nSecurityFilter.SCF_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10194", UserManager.Instance.User.Language),
                r = nSecurityFilter
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var inbox = repositorySecurityFilter.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = inbox });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiSecurityFilterController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ValidateSecurityFilter([FromBody]string id)
        {
            try
            {
                repositorySecurityFilter.ValidateSecurityFilter(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10196", UserManager.Instance.User.Language),
                    r = repositorySecurityFilter.Get(id)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiInboxController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10086", UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositorySecurityFilter.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10195", UserManager.Instance.User.Language)
            });
        }
    }
}