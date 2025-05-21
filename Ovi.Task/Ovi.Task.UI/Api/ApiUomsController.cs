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
    public class ApiUomsController : ApiController
    {
        private RepositoryUoms repositoryUoms;

        public ApiUomsController()
        {
            repositoryUoms = new RepositoryUoms();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMUOMS>.Count(gridRequest)
                    : repositoryUoms.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUomsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMUOMS nUom)
        {
            repositoryUoms.SaveOrUpdate(nUom);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10076", UserManager.Instance.User.Language),
                r = nUom
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var uom = repositoryUoms.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = uom });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiUomsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryUoms.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10077", UserManager.Instance.User.Language)
            });
        }
    }
}