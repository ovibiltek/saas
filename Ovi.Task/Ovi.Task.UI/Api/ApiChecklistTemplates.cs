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
    public class ApiChecklistTemplatesController : ApiController
    {
        private RepositoryChecklistTemplates repositoryChecklistTemplates;

        public ApiChecklistTemplatesController()
        {
            repositoryChecklistTemplates = new RepositoryChecklistTemplates();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMCHKLISTTEMPLATES>.Count(gridRequest)
                    : repositoryChecklistTemplates.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistTemplatesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCHKLISTTEMPLATES nChecklistTemplate)
        {
            repositoryChecklistTemplates.SaveOrUpdate(nChecklistTemplate);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10040", UserManager.Instance.User.Language),
                r = nChecklistTemplate
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var checklistTemplate = repositoryChecklistTemplates.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = checklistTemplate
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistTemplatesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            if (id != null)
            {
                repositoryChecklistTemplates.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10041", UserManager.Instance.User.Language)
            });
        }
    }
}