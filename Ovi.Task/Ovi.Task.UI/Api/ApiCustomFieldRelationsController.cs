using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiCustomFieldRelationsController : ApiController
    {
        private RepositoryCustomFieldRelations repositoryCustomFieldRelations;

        public ApiCustomFieldRelationsController()
        {
            repositoryCustomFieldRelations = new RepositoryCustomFieldRelations();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMCUSTOMFIELDRELATIONS>.Count(gridRequest);
                var data = repositoryCustomFieldRelations.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data, total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldRelationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetCustomFields(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var repositoryCustomFields = new RepositoryCustomFields();
                var customfields = repositoryCustomFieldRelations.List(gridRequest);
                var data = repositoryCustomFields.ListByCodes(customfields.Select(x => x.CFR_CODE).ToArray<object>());

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = new
                    {
                        customfields = data,
                        customfieldrelations = from y in customfields
                                               select new
                                               {
                                                   y.CFR_CODE,
                                                   y.CFR_AUTH,
                                                   y.CFR_ENTITY,
                                                   y.CFR_GROUP,
                                                   y.CFR_GROUPDESC,
                                                   y.CFR_TYPEDESC
                                               }
                    }
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldRelationsController", "GetCustomFields");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUSTOMFIELDRELATIONS nCustomFieldRelation)
        {
            repositoryCustomFieldRelations.SaveOrUpdate(nCustomFieldRelation);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10078", UserManager.Instance.User.Language),
                r = nCustomFieldRelation
            });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var cfrs = repositoryCustomFieldRelations.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cfrs
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldRelationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryCustomFieldRelations.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10079", UserManager.Instance.User.Language)
            });
        }
    }
}