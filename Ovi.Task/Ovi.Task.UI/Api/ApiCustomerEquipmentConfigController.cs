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
    public class ApiCustomerEquipmentConfigController : ApiController
    {
        private RepositoryCustomerEquipmentConfig repositoryCustomerEquipmentConfig;
        private RepositoryTasks repositoryTasks;

        public ApiCustomerEquipmentConfigController()
        {
            repositoryCustomerEquipmentConfig = new RepositoryCustomerEquipmentConfig();
            repositoryTasks = new RepositoryTasks();
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
                        data = RepositoryShared<TMCUSTOMEREQUIPMENTCONFIG>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryCustomerEquipmentConfig.List(gridRequest);
                        total = RepositoryShared<TMCUSTOMEREQUIPMENTCONFIG>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomerEquipmentConfigController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCUSTOMEREQUIPMENTCONFIG nSysCode)
        {
            repositoryCustomerEquipmentConfig.SaveOrUpdate(nSysCode);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10656", UserManager.Instance.User.Language),
                r = nSysCode
            });
        }

        [HttpPost]
        public string Get([FromBody] long id)
        {
            try
            {
                var eqpconfig = repositoryCustomerEquipmentConfig.Get(id);
                var tasktypes = repositoryTasks.GetTaskTypes(eqpconfig.CEC_TSKTYPE);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = eqpconfig,
                    tasktypes = tasktypes
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCustomerEquipmentConfigController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] long id)
        {
            repositoryCustomerEquipmentConfig.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10655", UserManager.Instance.User.Language)
            });
        }
    }
}