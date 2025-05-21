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
    public class ApiPurchaseOrderLinesController : ApiController
    {
        private RepositoryPurchaseOrderLines repositoryPurchaseOrderLines;

        public ApiPurchaseOrderLinesController()
        {
            repositoryPurchaseOrderLines = new RepositoryPurchaseOrderLines();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPURCHASEORDERLINES>.Count(gridRequest)
                    : repositoryPurchaseOrderLines.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryPurchaseOrderLines.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10433", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMPURCHASEORDERLINES mPurchaseOrderLine)
        {
            repositoryPurchaseOrderLines.SaveOrUpdate(mPurchaseOrderLine);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10432", UserManager.Instance.User.Language),
                r = mPurchaseOrderLine
            });
        }

        [HttpPost]
        [Transaction]
        public string GetRemaining(TMPOLINESUMMARYVIEW mTMPOLINESUMMARYVIEW)
        {
            try
            {
                var remaining = repositoryPurchaseOrderLines.GetRemaining(mTMPOLINESUMMARYVIEW);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = remaining
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
           
        }
        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var purchaseOrder = repositoryPurchaseOrderLines.Get(id);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = purchaseOrder,
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetListView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "POL_ORG");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMPURCHASEORDERLINEVIEW>.Count(gridRequest)
                    : repositoryPurchaseOrderLines.GetLines(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderLinesController", "GetListView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetTrackView(TMPURCHASEORDERLINETRACK mTMPurchaseOrderLineTrack)
        {
            try
            {
                var lines = repositoryPurchaseOrderLines.GetPurchaseOrderLineTracks(mTMPurchaseOrderLineTrack);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lines
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderLinesController", "GetTrackView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        public string SaveTracks(TMPURCHASEORDERLINETRACK[] mPurchaseOrderTracks)
        {
            try
            {
                foreach (var item in mPurchaseOrderTracks)
                {
                    TMPURCHASEORDERLINES rPurchaseOrderLine = repositoryPurchaseOrderLines.Get(item.PRT_ID); //PRT_ID = PRL_ID For View

                    if (rPurchaseOrderLine.PRL_CARGOCOMPANY != item.PRT_CARGOCOMPANY 
                        || rPurchaseOrderLine.PRL_CARGODATE != item.PRT_CARGODATE 
                        || rPurchaseOrderLine.PRL_CARGONUMBER != item.PRT_CARGONUMBER) //SADECE CARGO BILGISI DEGISEN UPDATE OLUR
                    {
                        rPurchaseOrderLine.PRL_CARGOCOMPANY = item.PRT_CARGOCOMPANY;
                        rPurchaseOrderLine.PRL_CARGODATE = item.PRT_CARGODATE;
                        rPurchaseOrderLine.PRL_CARGONUMBER = item.PRT_CARGONUMBER;
                        rPurchaseOrderLine.PRL_UPDATED = DateTime.Now;
                        rPurchaseOrderLine.PRL_UPDATEDBY = User.Identity.Name;

                        repositoryPurchaseOrderLines.SaveOrUpdate(rPurchaseOrderLine);
                    }
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10443", UserManager.Instance.User.Language),
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiPurchaseOrderLinesController", "GetTrackView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
    }
}