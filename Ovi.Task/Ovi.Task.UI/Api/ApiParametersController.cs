using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Configuration;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiParametersController : ApiController
    {
        private RepositoryParameters repositoryParameters;

        public ApiParametersController()
        {
            repositoryParameters = new RepositoryParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPARAMETERS>.Count(gridRequest)
                    : repositoryParameters.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiParametersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPARAMETERS nParameter)
        {
            if (nParameter.PRM_ISENCRYPTED == '+' && nParameter.PRM_VALUE.Length != 128)
            {
                nParameter.PRM_VALUE = StringCipher.Encrypt(nParameter.PRM_VALUE, ConfigurationManager.AppSettings["encrypt"]);
            }

            repositoryParameters.SaveOrUpdate(nParameter);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10021", UserManager.Instance.User.Language),
                r = nParameter
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var prm = repositoryParameters.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = prm });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiParametersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            if (id != null)
            {
                repositoryParameters.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10022", UserManager.Instance.User.Language)
            });
        }
    }
}