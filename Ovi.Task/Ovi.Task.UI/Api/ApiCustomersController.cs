using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.TreeView;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiCustomersController : ApiController
    {
        private RepositoryCustomers repositoryCustomers;

        public ApiCustomersController()
        {
            repositoryCustomers = new RepositoryCustomers();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, "CUS_CODE", "CUS_ORG");
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMCUSTOMERS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryCustomers.List(gridRequest);
                        total = RepositoryShared<TMCUSTOMERS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomersController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(CustomerModel mCustomer)
        {
            repositoryCustomers.SaveOrUpdate(mCustomer.Customer);

            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("CUSTOMER", mCustomer.Customer.CUS_CODE, mCustomer.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10098", UserManager.Instance.User.Language),
                r = mCustomer.Customer
            });
        }

        [HttpPost]
        public string Get([FromBody]string id)
        {
            try
            {
                var customer = repositoryCustomers.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = customer,
                    pmusers = !string.IsNullOrEmpty(customer.CUS_PM) ? new RepositoryUsers().GetUsers(customer.CUS_PM) : null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomersController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]string id)
        {
            repositoryCustomers.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10099", UserManager.Instance.User.Language)
            });
        }
    }
}