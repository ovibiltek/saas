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
    public class ApiLocationsController : ApiController
    {
        private RepositoryLocations repositoryLocations;

        public ApiLocationsController()
        {
            repositoryLocations = new RepositoryLocations();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "LOC_CUSTOMER", "LOC_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMLOCATIONS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryLocations.List(gridRequest);
                        total = RepositoryShared<TMLOCATIONS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLocationsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMLOCATIONS nLocation)
        {
            repositoryLocations.SaveOrUpdate(nLocation);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10026", UserManager.Instance.User.Language),
                r = nLocation
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var location = repositoryLocations.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = location });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLocationsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            if (id != null)
            {
                repositoryLocations.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10027", UserManager.Instance.User.Language)
            });
        }
    }
}