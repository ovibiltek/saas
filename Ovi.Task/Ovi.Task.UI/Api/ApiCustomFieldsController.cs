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
    public class CustomFieldParam
    {
        public string Subject { get; set; }

        public string Source { get; set; }
    }

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiCustomFieldsController : ApiController
    {
        private RepositoryCustomFields repositoryCustomFields;

        public ApiCustomFieldsController()
        {
            repositoryCustomFields = new RepositoryCustomFields();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMCUSTOMFIELDS>.Count(gridRequest);
                var data = repositoryCustomFields.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data, total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUSTOMFIELDS nCustomField)
        {
            repositoryCustomFields.SaveOrUpdate(nCustomField);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10048", UserManager.Instance.User.Language),
                r = nCustomField
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var field = repositoryCustomFields.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = field,
                    descriptions = new RepositoryDescriptions().List("TMCUSTOMFIELDS", "TEXT", field.CFD_CODE)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryCustomFields.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10049", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string GetCustomFieldValues(CustomFieldParam cfp)
        {
            try
            {
                var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
                var customfieldvalues = repositoryCustomFieldValues.GetBySubjectAndSource(cfp.Subject, cfp.Source);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = customfieldvalues
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomFieldsController", "GetCustomFieldValues");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}