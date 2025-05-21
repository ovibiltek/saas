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
    public class ApiBinsController : ApiController
    {
        private RepositoryBins repositoryBins;

        public ApiBinsController()
        {
            repositoryBins = new RepositoryBins();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMBINS>.Count(gridRequest)
                    : repositoryBins.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBinsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMBINS nBin)
        {
            repositoryBins.SaveOrUpdate(nBin);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10074", UserManager.Instance.User.Language),
                r = nBin
            });
        }

        [HttpPost]
        public string Get(TMBINS pBin)
        {
            try
            {
                var bin = repositoryBins.Get(pBin);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = bin
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBinsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TMBINS pBin)
        {
            repositoryBins.DeleteByEntity(pBin);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10075", UserManager.Instance.User.Language)
            });
        }
    }
}