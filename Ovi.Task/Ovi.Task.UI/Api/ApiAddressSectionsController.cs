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
    public class ApiAddressSectionsController : ApiController
    {
        private RepositoryAddressSections repositoryAddressSections;

        public ApiAddressSectionsController()
        {
            repositoryAddressSections = new RepositoryAddressSections();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMADDRESSSECTIONS>.Count(gridRequest)
                    : repositoryAddressSections.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiAddressSectionsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMADDRESSSECTIONS nAddressSection)
        {
            repositoryAddressSections.SaveOrUpdate(nAddressSection);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10100", UserManager.Instance.User.Language),
                r = nAddressSection
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var addressSection = repositoryAddressSections.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = addressSection
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiAddressSectionsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryAddressSections.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10101", UserManager.Instance.User.Language)
            });
        }
    }
}