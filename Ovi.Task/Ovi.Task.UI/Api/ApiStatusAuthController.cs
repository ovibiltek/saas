using Microsoft.Ajax.Utilities;
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
    public class DefaultStatusReq
    {
        public string Entity { get; set; }

        public string Type { get; set; }

        public string From { get; set; }

        public string UsrGroup { get; set; }
    }
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiStatusAuthController : ApiController
    {
        private RepositoryStatusAuth repositoryStatusAuth;

        public ApiStatusAuthController()
        {
            repositoryStatusAuth = new RepositoryStatusAuth();
        }

        [HttpPost]
        public string RetrieveStatuses(RetrieveByAuthParams retrieveByUserGroupParams)
        {
            try
            {
                var lst = repositoryStatusAuth.RetrieveByAuth(retrieveByUserGroupParams).DistinctBy(x => x.SAU_TO);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lst
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusAuthController", "RetrieveStatuses");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListWorkflowItems(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = repositoryStatusAuth.ListView(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusAuthController", "ListWorkflowItems");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var total = RepositoryShared<TMSTATUSAUTHVIEW>.Count(gridRequest);
                object data = repositoryStatusAuth.ListView(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusAuthController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSTATUSAUTH status)
        {
            repositoryStatusAuth.SaveOrUpdate(status, status.SAU_ID == 0);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10019", UserManager.Instance.User.Language),
                r = status
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var staauth = repositoryStatusAuth.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = staauth });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusAuthController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryStatusAuth.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10020", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string GetDefaultStatus(DefaultStatusReq dsr)
        {
            try
            {
                var d = repositoryStatusAuth.DefaultStatus(dsr.Entity, dsr.Type, dsr.From, dsr.UsrGroup);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = d
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusAuthController", "GetDefaultSa");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}