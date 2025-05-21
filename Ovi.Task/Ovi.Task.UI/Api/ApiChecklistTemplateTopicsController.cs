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
    public class ApiChecklistTemplateTopicsController : ApiController
    {
        private RepositoryChecklistTemplateTopics repositoryChecklistTemplateTopics;

        public ApiChecklistTemplateTopicsController()
        {
            repositoryChecklistTemplateTopics = new RepositoryChecklistTemplateTopics();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMCHKLISTTEMPLATETOPICS>.Count(gridRequest)
                    : repositoryChecklistTemplateTopics.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistTemplateTopicsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCHKLISTTEMPLATETOPICS nChecklistTemplateTopic)
        {
            repositoryChecklistTemplateTopics.SaveOrUpdate(nChecklistTemplateTopic);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10679", UserManager.Instance.User.Language),
                r = nChecklistTemplateTopic
            });
        }

        [HttpPost]
        public string Get(TMCHKLISTTEMPLATETOPICS pChecklistTemplateTopic)
        {
            try
            {
                var topic = repositoryChecklistTemplateTopics.Get(pChecklistTemplateTopic);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = topic
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistTemplateTopicsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TMCHKLISTTEMPLATETOPICS pChecklistTemplateTopic)
        {
            repositoryChecklistTemplateTopics.DeleteByEntity(pChecklistTemplateTopic);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10680", UserManager.Instance.User.Language)
            });
        }
    }
}