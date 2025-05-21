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
    public class ApiMobileSessionsController : ApiController
    {
        private RepositoryMobileSessions repositoryMobileSessions;

        public ApiMobileSessionsController()
        {
            repositoryMobileSessions = new RepositoryMobileSessions();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstOfDocuments = repositoryMobileSessions.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstOfDocuments,
                    total = RepositoryShared<TMMOBILESESSIONS>.Count(gridRequest)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "RepositoryMobileSessions", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}