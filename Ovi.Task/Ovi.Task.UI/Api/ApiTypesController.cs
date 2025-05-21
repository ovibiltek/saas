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
    public class ApiTypesController : ApiController
    {
        public class TypeParams
        {
            public string Entity { get; set; }

            public string Code { get; set; }
        }

        private RepositoryTypes repositoryTypes;

        public ApiTypesController()
        {
            repositoryTypes = new RepositoryTypes();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "TYP_ORGANIZATION");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMTYPES>.Count(gridRequest)
                    : repositoryTypes.List(gridRequest);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTypesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListByDepartment(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.Filter(gridRequest, null, "TYP_ORGANIZATION");
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMDEPARTMENTTYPESVIEW>.Count(gridRequest)
                    : repositoryTypes.ListByDepartment(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTypesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTYPES nType)
        {
            repositoryTypes.SaveOrUpdate(nType, nType.TYP_SQLIDENTITY == 0);
            var repositoryDescriptions = new RepositoryDescriptions();
            repositoryDescriptions.SaveOrUpdate(new TMDESCRIPTIONS
            {
                DES_CLASS = "TMTYPES",
                DES_PROPERTY = "TYP_DESC",
                DES_CODE = string.Format("{0}#{1}", nType.TYP_ENTITY, nType.TYP_CODE),
                DES_TEXT = nType.TYP_DESC,
                DES_LANG = UserManager.Instance.User.Language
            });

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10024", UserManager.Instance.User.Language),
                r = nType
            });
        }

        [HttpPost]
        public string Get(TypeParams tp)
        {
            try
            {
                var typ = repositoryTypes.Get(new TMTYPES { TYP_ENTITY = tp.Entity, TYP_CODE = tp.Code });
                return JsonConvert.SerializeObject(new { status = 200, data = typ });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTypesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec(TypeParams typeParams)
        {
            repositoryTypes.DeleteByEntity(new TMTYPES { TYP_ENTITY = typeParams.Entity, TYP_CODE = typeParams.Code });
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10025", UserManager.Instance.User.Language)
            });
        }
    }
}