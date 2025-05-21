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
    public class ApiWarehouseTransferLinesController : ApiController
    {
        private RepositoryWarehouseTransferLines repositoryWarehouseTransferLines;

        public ApiWarehouseTransferLinesController()
        {
            repositoryWarehouseTransferLines = new RepositoryWarehouseTransferLines();
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
                        data = RepositoryShared<TMWAREHOUSETRANSFERLINES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryWarehouseTransferLines.List(gridRequest);
                        total = RepositoryShared<TMWAREHOUSETRANSFERLINES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseTransferLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMWAREHOUSETRANSFERLINES nWarehouseTransferLine)
        {
            repositoryWarehouseTransferLines.SaveOrUpdate(nWarehouseTransferLine);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10181", UserManager.Instance.User.Language),
                r = nWarehouseTransferLine
            });
        }

        [HttpPost]
        public string Get([FromBody]int r)
        {
            try
            {
                var warehouseTransferLine = repositoryWarehouseTransferLines.Get(r);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = warehouseTransferLine
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiWarehouseTransferLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int r)
        {
            repositoryWarehouseTransferLines.DeleteById(r);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10182", UserManager.Instance.User.Language)
            });
        }
    }
}