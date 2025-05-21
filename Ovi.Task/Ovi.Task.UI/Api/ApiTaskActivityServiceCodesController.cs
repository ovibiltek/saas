using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTaskActivityServiceCodesController : ApiController
    {
        private RepositoryTaskActivityServiceCodes repositoryTaskActivityServiceCodes;
        private RepositoryTaskActivities repositoryTaskActivities;
        private RepositoryEquipments repositoryEquipments;



        public ApiTaskActivityServiceCodesController()
        {
            repositoryTaskActivityServiceCodes = new RepositoryTaskActivityServiceCodes();
            repositoryTaskActivities = new RepositoryTaskActivities();
            repositoryEquipments = new RepositoryEquipments();
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
                        data = RepositoryShared<TMTASKACTIVITYSERVICECODES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskActivityServiceCodes.List(gridRequest);
                        total = RepositoryShared<TMTASKACTIVITYSERVICECODES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityServiceCodesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]int id)
        {
            if (id != 0)
            {
                repositoryTaskActivityServiceCodes.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10176", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTASKACTIVITYSERVICECODES taskActivityServiceCode)
        {
            repositoryTaskActivityServiceCodes.SaveOrUpdate(taskActivityServiceCode);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10175", UserManager.Instance.User.Language),
                r = taskActivityServiceCode
            });
        }

    }
}