using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class PreSalesModel
    {
        public TMPRESALES PreSales { get; set; }
        public TMCUSTOMFIELDVALUES[] CustomFieldValues { get; set; }
    }

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPreSalesController : ApiController
    {
        private RepositoryPreSales repositoryPreSales;

        public ApiPreSalesController()
        {
            repositoryPreSales = new RepositoryPreSales();
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
                        data = RepositoryShared<TMPRESALES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryPreSales.List(gridRequest);
                        total = RepositoryShared<TMPRESALES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPreSalesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;
                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPRESALESVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryPreSales.ListView(gridRequest);
                        total = RepositoryShared<TMPRESALESVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPreSalesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(PreSalesModel nPreSales)
        {
            repositoryPreSales.SaveOrUpdate(nPreSales.PreSales);
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("PRESALES", nPreSales.PreSales.PRS_ID.ToString(), nPreSales.CustomFieldValues);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10064", UserManager.Instance.User.Language),
                r = nPreSales
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var presale = repositoryPreSales.Get(id);
                var status = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = presale.PRS_STATUS, STA_ENTITY = "PRESALES" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = presale,
                    stat = status
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPreSalesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryPreSales.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10065", UserManager.Instance.User.Language)
            });
        }
    }
}