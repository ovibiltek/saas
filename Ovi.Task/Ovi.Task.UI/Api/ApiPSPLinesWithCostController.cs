using System;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    public class ApiPSPLinesWithCostController:ApiController
    {
        private RepositoryPSPLinesWithCost repositoryPSPLinesWithCost;

        public ApiPSPLinesWithCostController()
        {
            repositoryPSPLinesWithCost = new RepositoryPSPLinesWithCost();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                int total = 0;

                if (gridRequest.action == "CNT")
                {
                    data = RepositoryShared<TMPSPLINESWITHCOSTVIEW>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryPSPLinesWithCost.List(gridRequest);
                    total = (int)RepositoryShared<TMPSPLINESWITHCOSTVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPSPLinesWithCostController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

    }
}