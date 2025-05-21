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
    public class ApiCubesController : ApiController
    {
        private RepositoryCubes repositoryCubes;

        public ApiCubesController()
        {
            repositoryCubes = new RepositoryCubes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                object data;
                long total = 0;
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMCUBES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryCubes.List(gridRequest);
                        total = RepositoryShared<TMCUBES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCubesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUBES nCube)
        {
            repositoryCubes.SaveOrUpdate(nCube);
            return JsonConvert.SerializeObject(new { status = 200, r = nCube });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var cube = repositoryCubes.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = cube });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCubesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryCubes.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, });
        }
    }
}