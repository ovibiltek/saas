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
    public class ApiQualificationsController : ApiController
    {
        private RepositoryQualifications repositoryQualifications;

        public ApiQualificationsController()
        {
            repositoryQualifications = new RepositoryQualifications(); ;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMQUALIFICATIONS>.Count(gridRequest)
                    : repositoryQualifications.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQualificationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMQUALIFICATIONS nQualifications)
        {
            repositoryQualifications.SaveOrUpdate(nQualifications);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10670", UserManager.Instance.User.Language),
                r = nQualifications
            });
        }


        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var qualifications = repositoryQualifications.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = qualifications });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiQualificationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryQualifications.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10671", UserManager.Instance.User.Language) });
        }

    }
}