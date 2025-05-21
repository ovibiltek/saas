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
    public class ApiContractEquipManPricesController : ApiController
    {
        private RepositoryContractEquipManPrices repositoryContractEquipManPrices;
        public class DeleteLines
        {
            public List<int> Lines { get; set; }
        }
        public ApiContractEquipManPricesController()
        {
            repositoryContractEquipManPrices = new RepositoryContractEquipManPrices(); ;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMCONTRACTEQUIPMANPRICES>.Count(gridRequest)
                    : repositoryContractEquipManPrices.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractEquipManPricesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(TMCONTRACTEQUIPMANPRICES nContractEquipManPrices)
        {
            repositoryContractEquipManPrices.SaveOrUpdate(nContractEquipManPrices, nContractEquipManPrices.CMP_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10446", UserManager.Instance.User.Language),
                r = nContractEquipManPrices
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var contractequipmanprices = repositoryContractEquipManPrices.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = contractequipmanprices });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiContractEquipManPricesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryContractEquipManPrices.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10447", UserManager.Instance.User.Language) });
        }

        [HttpPost]
        [Transaction]
        public string DeleteAll(DeleteLines lines)
        {
            foreach (var item in lines.Lines)
            {
                repositoryContractEquipManPrices.DeleteById(item);
            }
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10447", UserManager.Instance.User.Language) });

        }
    }
}