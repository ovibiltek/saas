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
    public class ApiLaborsController : ApiController
    {
        private RepositoryLabors repositoryLabors;

        public ApiLaborsController()
        {
            repositoryLabors = new RepositoryLabors();
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
                        data = RepositoryShared<TMLABORS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryLabors.List(gridRequest);
                        total = RepositoryShared<TMLABORS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLaborsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMLABORS nLabor)
        {
            repositoryLabors.UpdateLaborTotal(nLabor);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10175", UserManager.Instance.User.Language), labor = nLabor });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var labor = repositoryLabors.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = labor,
                    users = new RepositoryUsers().GetUsers(labor.LAB_ASSIGNEDTO)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiLaborsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryLabors.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10176", UserManager.Instance.User.Language) });
        }
    }
}