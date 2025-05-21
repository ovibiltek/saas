using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.CustomFields;
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
    public class ApiCustomFieldGroupsController : ApiController
    {
        private RepositoryCustomFieldGroups repositoryCustomFieldGroups;

        public ApiCustomFieldGroupsController()
        {
            repositoryCustomFieldGroups = new RepositoryCustomFieldGroups();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMCUSTOMFIELDGROUPS>.Count(gridRequest);
                var data = repositoryCustomFieldGroups.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data, total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldGroupsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUSTOMFIELDGROUPS nCustomFieldGroup)
        {
            repositoryCustomFieldGroups.SaveOrUpdate(nCustomFieldGroup, nCustomFieldGroup.CFG_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10096", UserManager.Instance.User.Language),
                r = nCustomFieldGroup
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var field = repositoryCustomFieldGroups.Get(id);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = field,
                    descriptions = new RepositoryDescriptions().List("TMCUSTOMFIELDGROUPS", "TEXT", field.CFG_CODE)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldGroupsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryCustomFieldGroups.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10097", UserManager.Instance.User.Language)
            });
        }
    }
}