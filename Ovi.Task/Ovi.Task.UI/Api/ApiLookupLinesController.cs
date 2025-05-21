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
    public class ApiLookupLinesController : ApiController
    {
        private RepositoryLookupLines repositoryLookupLines;

        public ApiLookupLinesController()
        {
            repositoryLookupLines = new RepositoryLookupLines();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMLOOKUPLINES>.Count(gridRequest)
                    : repositoryLookupLines.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLookupLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMLOOKUPLINES nLookupLine)
        {
            repositoryLookupLines.SaveOrUpdate(nLookupLine);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10054", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var lookupLine = repositoryLookupLines.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = lookupLine });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLookupLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryLookupLines.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10055", UserManager.Instance.User.Language)
            });
        }
    }
}