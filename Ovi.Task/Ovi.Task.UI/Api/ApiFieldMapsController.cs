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
    public class ApiFieldMapsController : ApiController
    {
        private RepositoryFieldMaps repositoryFieldMaps;

        public ApiFieldMapsController()
        {
            repositoryFieldMaps = new RepositoryFieldMaps();
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
                        data = RepositoryShared<TMFIELDMAPS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryFieldMaps.List(gridRequest);
                        total = RepositoryShared<TMFIELDMAPS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFieldMapsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(FieldMapsModel fmap)
        {
            repositoryFieldMaps.SaveList(fmap);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10309", UserManager.Instance.User.Language)
            });
        }
    }
}