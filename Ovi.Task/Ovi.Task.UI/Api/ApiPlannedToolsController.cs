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
    public class ApiPlannedToolsController : ApiController
    {
        private RepositoryPlannedTools repositoryPlannedTools;

        public ApiPlannedToolsController()
        {
            repositoryPlannedTools = new RepositoryPlannedTools();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPLANNEDTOOLS>.Count(gridRequest)
                    : repositoryPlannedTools.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPlannedToolsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPLANNEDTOOLS nPlannedTool)
        {
            repositoryPlannedTools.SaveOrUpdate(nPlannedTool);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10163", UserManager.Instance.User.Language),
                r = nPlannedTool
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var plntool = repositoryPlannedTools.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = plntool });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPlannedToolsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPlannedTools.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10164", UserManager.Instance.User.Language) });
        }
    }
}