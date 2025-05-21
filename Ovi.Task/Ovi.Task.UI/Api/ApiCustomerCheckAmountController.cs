using Ovi.Task.UI.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Data.Helper;
using Newtonsoft.Json;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiCustomerCheckAmountController:ApiController
    {
        public class prmSave
        {
            public string Id { get; set; }
            public TMCUSTOMERCHECKAMOUNT[] Items { get; set; }
        }

        private RepositoryCustomerCheckAmount repositoryCustomerCheckAmount;

        public ApiCustomerCheckAmountController()
        {
            repositoryCustomerCheckAmount = new RepositoryCustomerCheckAmount();
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
                    data = RepositoryShared<TMCUSTOMERCHECKAMOUNT>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryCustomerCheckAmount.List(gridRequest);
                    total = (int)RepositoryShared<TMCUSTOMERCHECKAMOUNT>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomerCheckAmountController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        //[Auth(Type = "SAVE")]
        [Transaction]
        public string Save(prmSave p)
        {
            repositoryCustomerCheckAmount.Save(p.Id, p.Items);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10095", UserManager.Instance.User.Language),
                r = p
            });
        }

    }
}