using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiPurchaseOrderRequisitionLinesController : ApiController
    {
        private RepositoryPurchaseOrderRequisitionLines repositoryPurchaseOrderRequisitionLines;

        public ApiPurchaseOrderRequisitionLinesController()
        {
            repositoryPurchaseOrderRequisitionLines = new RepositoryPurchaseOrderRequisitionLines();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstOfDocuments = repositoryPurchaseOrderRequisitionLines.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstOfDocuments
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryPurchaseOrderRequisitionLines.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10460", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPURCHASEORDERREQUISITIONLINES mPurchaseOrderLine)
        {
            repositoryPurchaseOrderRequisitionLines.SaveOrUpdate(mPurchaseOrderLine);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10459", UserManager.Instance.User.Language),
                r = mPurchaseOrderLine
            });
        }

      
        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var purchaseOrder = repositoryPurchaseOrderRequisitionLines.Get(id);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = purchaseOrder,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetListView()
        {
            try
            {
                var lines = repositoryPurchaseOrderRequisitionLines.GetLines();

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lines
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionLinesController", "GetList");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetListWithOrdersView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lines = repositoryPurchaseOrderRequisitionLines.GetLinesWithOrder(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lines
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderRequisitionLinesController", "GetListWithOrdersView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}