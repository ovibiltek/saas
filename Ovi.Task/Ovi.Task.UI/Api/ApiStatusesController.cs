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
    public class ApiStatusesController : ApiController
    {
        private RepositoryStatuses repositoryStatuses;

        public ApiStatusesController()
        {
            repositoryStatuses = new RepositoryStatuses();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSTATUSES>.Count(gridRequest)
                    : repositoryStatuses.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSTATUSES nStatus)
        {
            repositoryStatuses.SaveOrUpdate(nStatus, nStatus.STA_SQLIDENTITY == 0);

            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMSTATUSES",
                DES_PROPERTY = "STA_DESC",
                DES_CODE = string.Format("{0}#{1}", nStatus.STA_ENTITY, nStatus.STA_CODE),
                DES_TEXT = nStatus.STA_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10017", UserManager.Instance.User.Language),
                r = nStatus
            });
        }

        [HttpPost]
        public string Get(TMSTATUSES s)
        {
            try
            {
                var status = repositoryStatuses.Get(s);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = status
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStatusesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TMSTATUSES s)
        {
            repositoryStatuses.DeleteByEntity(s);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10018", UserManager.Instance.User.Language)
            });
        }
    }
}