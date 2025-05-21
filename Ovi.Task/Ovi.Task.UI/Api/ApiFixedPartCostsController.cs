using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiFixedPartCostsController:ApiController
    {
        private RepositoryFixedPartCosts repositoryFixedPartCosts;

        public ApiFixedPartCostsController()
        {
            repositoryFixedPartCosts = new RepositoryFixedPartCosts();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                int total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMFIXEDPARTCOSTS>.Count(gridRequest);
                        total = 0;
                        break;
                    default:
                        data = repositoryFixedPartCosts.List(gridRequest);
                        total = (int)RepositoryShared<TMFIXEDPARTCOSTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFixedPartCostsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMFIXEDPARTCOSTS nFixedPartCosts)
        {
            repositoryFixedPartCosts.SaveOrUpdate(nFixedPartCosts);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10199", UserManager.Instance.User.Language),
                r = nFixedPartCosts
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var fixedPartCosts = repositoryFixedPartCosts.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = fixedPartCosts });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiFixedPartCostsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryFixedPartCosts.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10200", UserManager.Instance.User.Language) });
        }


    }
}