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
    public class ApiBrandsController : ApiController
    {
        private RepositoryBrands repositoryBrands;

        public ApiBrandsController()
        {
            repositoryBrands = new RepositoryBrands();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMBRANDS>.Count(gridRequest)
                    : repositoryBrands.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBrandsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMBRANDS nBrand)
        {
            repositoryBrands.SaveOrUpdate(nBrand, nBrand.BRA_SQLIDENTITY == 0);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10137", UserManager.Instance.User.Language), r = nBrand });
        }

        [HttpPost]
        public string Get([FromBody] string id)
        {
            try
            {
                var brand = repositoryBrands.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = brand });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiBrandsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] string id)
        {
            repositoryBrands.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10138", UserManager.Instance.User.Language) });
        }
    }
}