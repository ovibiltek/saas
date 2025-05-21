using Newtonsoft.Json;

using System;
using System.Web.Http;
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
    public class ApiGridDesignerController : ApiController
    {
        private RepositoryGridDesigner repositoryGridDesigner;
        private RepositoryScreens repositoryScreens;

        public ApiGridDesignerController()
        {
            repositoryGridDesigner = new RepositoryGridDesigner();
            repositoryScreens = new RepositoryScreens();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMGRIDDESIGNER>.Count(gridRequest)
                    : repositoryGridDesigner.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiGridDesignerController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetColumnInfo([FromBody] string tableName)
        {
            try
            {
                var data = repositoryGridDesigner.GetColumns(tableName);

                var m = JsonConvert.SerializeObject(new { status = 200, data = data });
                return m;
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiGridDesignerController", "GetColumnInfo");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save([FromBody] TMGRIDDESIGNER grid)
        {

            if (grid.GRD_ID <= 0)
            {
                var scr = repositoryScreens.Get(grid.GRD_SCREENCODE);
                if (scr == null)
                    GridDesignerHelper.SaveToScreens(grid);

            }
            repositoryGridDesigner.SaveOrUpdate(grid);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10686", UserManager.Instance.User.Language),
                r = grid
            });
        }


        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var grid = repositoryGridDesigner.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = grid
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiGridDesignerController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositoryGridDesigner.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10687", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        public string GetGridDataByScrCode([FromBody] string scrcode)
        {

            try
            {
                var grid = repositoryGridDesigner.GetByScrCode(scrcode);
                return JsonConvert.SerializeObject(new { status = 200, data = grid });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiGridDesignerController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetTableData(GridRequest gridreq, string code)

        {
            try
            {
                gridreq = GridRequestHelper.BuildFunctionFilter(gridreq);
                if (!(gridreq.filter == null || gridreq.filter.Filters == null))
                {
                    gridreq = GridDesignerHelper.SQLtoCsharpTypeConverter(gridreq, code);
                }
                if (gridreq.action == "CNT")
                {
                    var count = repositoryGridDesigner.GetGridDataCount(gridreq, code);
                    return JsonConvert.SerializeObject(new { status = 200, data = count });
                }
                var grid = repositoryGridDesigner.GetGridData(gridreq, code);
                var nlist = GridDesignerHelper.CreateDictionary(grid);
                return JsonConvert.SerializeObject(new { status = 200, data = nlist });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiGridDesignerController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetAllTables(GridRequest gridreq)
        {
            try
            {
                gridreq = GridRequestHelper.BuildFunctionFilter(gridreq);
                var tables = repositoryGridDesigner.GetTables(gridreq);
                return JsonConvert.SerializeObject(new { status = 200, data = tables });
            }
            catch (Exception e)
            {

                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiGridDesignerController", "GetAllTables");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

    }
}