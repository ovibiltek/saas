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
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPartialPaymentsController : ApiController
    {
        private RepositoryPartialPayments repositoryPartialPayments;

        public ApiPartialPaymentsController()
        {
            repositoryPartialPayments = new RepositoryPartialPayments();
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
                        data = RepositoryShared<TMPARTIALPAYMENTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryPartialPayments.List(gridRequest);
                        total = RepositoryShared<TMPARTIALPAYMENTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartialPaymentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPARTIALPAYMENTS mPart)
        {
            repositoryPartialPayments.SaveOrUpdate(mPart);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10651", UserManager.Instance.User.Language),
                parid = mPart
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var par = repositoryPartialPayments.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = par
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPartialPaymentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryPartialPayments.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10652", UserManager.Instance.User.Language)
            });
        }
    }
}