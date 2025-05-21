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
    public class ApiStockController : ApiController
    {
        private RepositoryStock repositoryStock;

        public ApiStockController()
        {
            repositoryStock = new RepositoryStock();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMSTOCK>.Count(gridRequest)
                    : repositoryStock.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStockController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMSTOCK nStock)
        {
            repositoryStock.SaveOrUpdate(nStock);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10080", UserManager.Instance.User.Language), r = nStock });
        }

        [HttpPost]
        public string Get(TMSTOCK s)
        {
            try
            {
                var stock = repositoryStock.Get(s);
                return JsonConvert.SerializeObject(new { status = 200, data = stock });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiStockController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TMSTOCK s)
        {
            repositoryStock.DeleteByEntity(s);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10081", UserManager.Instance.User.Language) });
        }
    }
}