using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    public class ApiProgressPaymentsSentForAppController : ApiController
    {
        private RepositoryProgressPaymentsSentForApp repositoryProggressPaymentsSentForApp;

        public ApiProgressPaymentsSentForAppController()
        {
            repositoryProggressPaymentsSentForApp = new RepositoryProgressPaymentsSentForApp();
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
                    data = RepositoryShared<TMPROGRESSPAYMENTSSENTFORAPPVIEW>.Count(gridRequest);
                    total = 0;
                }
                else
                {
                    data = repositoryProggressPaymentsSentForApp.List(gridRequest);
                    total = (int)RepositoryShared<TMPROGRESSPAYMENTSSENTFORAPPVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiProgressPaymentsSentForAppController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

    }
}