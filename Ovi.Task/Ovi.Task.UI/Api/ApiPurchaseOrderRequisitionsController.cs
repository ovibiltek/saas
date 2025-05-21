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
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPurchaseOrderRequisitionsController : ApiController
    {
        private RepositoryPurchaseOrderRequisitions repositoryPurchaseOrderRequisitions;

        public ApiPurchaseOrderRequisitionsController()
        {
            repositoryPurchaseOrderRequisitions = new RepositoryPurchaseOrderRequisitions();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstOfDocuments = repositoryPurchaseOrderRequisitions.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstOfDocuments,
                    total = RepositoryShared<TMPURCHASEORDERREQUISITIONS>.Count(gridRequest)
            });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryPurchaseOrderRequisitions.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10457", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPURCHASEORDERREQUISITIONS mPurchaseOrder)
        {
            repositoryPurchaseOrderRequisitions.SaveOrUpdate(mPurchaseOrder);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10458", UserManager.Instance.User.Language),
                r = mPurchaseOrder
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var purchaseOrder = repositoryPurchaseOrderRequisitions.Get(id);
                var purchaseOrderStatus = new RepositoryStatuses().Get(new TMSTATUSES { STA_CODE = purchaseOrder.PRQ_STATUS, STA_ENTITY = "PURCHASEORDERREQUEST" });

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = purchaseOrder,
                    stat = purchaseOrderStatus,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string GetTabCounts([FromBody]long id)
        {
            try
            {
                var cntlst = repositoryPurchaseOrderRequisitions.GetTabCounts(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cntlst
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionsController", "GetTabCounts");
                return JsonConvert.SerializeObject(new
                {
                    status = 500,
                    data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language)
                });
            }
        }

    }
}