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
    public class ApiTypeParametersController : ApiController
    {
        private RepositoryTypeParameters repositoryTypeParameters;

        public ApiTypeParametersController()
        {
            repositoryTypeParameters = new RepositoryTypeParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMTYPEPARAMETERS>.Count(gridRequest)
                    : repositoryTypeParameters.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTypeParametersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTYPEPARAMETERS nTypeParameter)
        {
            repositoryTypeParameters.SaveOrUpdate(nTypeParameter);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10089", UserManager.Instance.User.Language),
                r = nTypeParameter
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var typeParameter = repositoryTypeParameters.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = typeParameter });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiActivityTemplatesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryTypeParameters.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10090", UserManager.Instance.User.Language)
            });
        }
    }
}