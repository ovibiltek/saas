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
    public class ApiMailTemplatesController : ApiController
    {
        private RepositoryMailTemplates repositoryMailTemplates;

        public ApiMailTemplatesController()
        {
            repositoryMailTemplates = new RepositoryMailTemplates();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMMAILTEMPLATES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryMailTemplates.List(gridRequest);
                        total = RepositoryShared<TMMAILTEMPLATES>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMailTemplatesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMMAILTEMPLATES nMailTemplate)
        {
            repositoryMailTemplates.SaveOrUpdate(nMailTemplate, nMailTemplate.TMP_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10410", UserManager.Instance.User.Language),
                r = nMailTemplate
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var action = repositoryMailTemplates.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = action
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMailTemplatesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryMailTemplates.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10411", UserManager.Instance.User.Language)
            });
        }
    }
}