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
    public class ApiPartTransactionLineController : ApiController
    {
        private RepositoryPartTransactionLine repositoryPartTransactionLine;

        public ApiPartTransactionLineController()
        {
            repositoryPartTransactionLine = new RepositoryPartTransactionLine();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPARTTRANLINES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryPartTransactionLine.List(gridRequest);
                        total = RepositoryShared<TMPARTTRANLINES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartTransactionLineController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPARTTRANLINES nPartTransLine)
        {
            repositoryPartTransactionLine.SaveOrUpdate(nPartTransLine);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10114", UserManager.Instance.User.Language),
                r = nPartTransLine
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var parttransline = repositoryPartTransactionLine.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = parttransline });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartTransactionLineController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPartTransactionLine.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10115", UserManager.Instance.User.Language)
            });
        }
    }
}