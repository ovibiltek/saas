using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Project;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiProjectPricingController : ApiController
    {
        private RepositoryProjectPricing repositoryProjectPricing;

        public ApiProjectPricingController()
        {
            repositoryProjectPricing = new RepositoryProjectPricing();
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
                        data = RepositoryShared<TMPROJECTPRICING>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryProjectPricing.List(gridRequest);
                        total = RepositoryShared<TMPROJECTPRICING>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProjectPricingController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPROJECTPRICING projectPricing)
        {
            repositoryProjectPricing.SaveOrUpdate(projectPricing);
            return JsonConvert.SerializeObject(new { status = 200, data = "No message", r = projectPricing });
        }

        [HttpPost]
        [Transaction]
        public string SaveList(TMPROJECTPRICING[] prpjectPricingList)
        {
            foreach (var item in prpjectPricingList)
            {
                var oPP = repositoryProjectPricing.Get(item.PPR_ID);
                if (oPP != null)
                {
                    var nPP = (TMPROJECTPRICING)oPP.Clone();
                    nPP.PPR_USERQTY = item.PPR_USERQTY;
                    nPP.PPR_USERUNITPRICE = item.PPR_USERUNITPRICE;
                    repositoryProjectPricing.SaveOrUpdate(nPP);
                }
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10172", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string ListByProject([FromBody] long project)
        {
            try
            {
                var data = repositoryProjectPricing.ListByProject(project);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProjectPricingController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var pp = repositoryProjectPricing.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = pp });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProjectPricingController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryProjectPricing.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = "No message" });
        }
    }
}