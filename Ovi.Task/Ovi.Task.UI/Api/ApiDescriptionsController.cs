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
    public class ApiDescriptionsController : ApiController
    {
        private RepositoryDescriptions repositoryDescriptions;

        public ApiDescriptionsController()
        {
            repositoryDescriptions = new RepositoryDescriptions();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMDESCRIPTIONS>.Count(gridRequest)
                    : repositoryDescriptions.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDescriptionsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMDESCRIPTIONS[] descriptionList)
        {
            foreach (var t in descriptionList)
            {
                repositoryDescriptions.SaveOrUpdate(t);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10047", UserManager.Instance.User.Language),
                r = descriptionList
            });
        }
    }
}