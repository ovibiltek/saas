using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    public class ApiMobileSessionParametersController : ApiController
    {
        private RepositoryMobileSessionParameters repositoryMobileSessionParameters;

        public ApiMobileSessionParametersController()
        {
            repositoryMobileSessionParameters = new RepositoryMobileSessionParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT" ? (object)RepositoryShared<TMMOBILESESSIONPARAMETERS>.Count(gridRequest)
                    : repositoryMobileSessionParameters.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "RepositoryMobileSessionParameters", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}