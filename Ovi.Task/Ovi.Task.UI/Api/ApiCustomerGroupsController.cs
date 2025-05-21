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
    public class ApiCustomerGroupsController : ApiController
    {
        private RepositoryCustomerGroups repositoryCustomerGroups;

        public ApiCustomerGroupsController()
        {
            repositoryCustomerGroups = new RepositoryCustomerGroups();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMCUSTOMERGROUPS>.Count(gridRequest)
                    : repositoryCustomerGroups.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomerGroupsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUSTOMERGROUPS nCustomerGroup)
        {
            repositoryCustomerGroups.SaveOrUpdate(nCustomerGroup, nCustomerGroup.CUG_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10179", UserManager.Instance.User.Language),
                r = nCustomerGroup
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var customergroup = repositoryCustomerGroups.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = customergroup
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomerGroupsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryCustomerGroups.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10180", UserManager.Instance.User.Language)
            });
        }
    }
}