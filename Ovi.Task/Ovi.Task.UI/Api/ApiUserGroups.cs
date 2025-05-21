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
    public class ApiUserGroupsController : ApiController
    {
        private RepositoryUserGroups repositoryUserGroups;

        public ApiUserGroupsController()
        {
            repositoryUserGroups = new RepositoryUserGroups();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMUSERGROUPS>.Count(gridRequest)
                    : repositoryUserGroups.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserGroupsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUSERGROUPS nUsergroup)
        {
            repositoryUserGroups.SaveOrUpdate(nUsergroup, nUsergroup.UGR_SQLIDENTITY == 0);
            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMUSERGROUPS",
                DES_PROPERTY = "UGR_DESC",
                DES_CODE = nUsergroup.UGR_CODE,
                DES_TEXT = nUsergroup.UGR_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10007", UserManager.Instance.User.Language),
                r = nUsergroup
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var userGroup = repositoryUserGroups.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = userGroup });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUserGroupsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            if (id != null)
            {
                repositoryUserGroups.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10008", UserManager.Instance.User.Language)
            });
        }
    }
}