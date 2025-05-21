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
    public class ApiEntrustEquipmentsController:ApiController
    {

        private RepositoryEntrustEquipments repositoryEntrustEquipments;

        public ApiEntrustEquipmentsController()
        {
            repositoryEntrustEquipments = new RepositoryEntrustEquipments();
        }


        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                int total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMENTRUSTEQUIPMENTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryEntrustEquipments.List(gridRequest);
                        total = (int)RepositoryShared<TMENTRUSTEQUIPMENTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustEquipmentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMENTRUSTEQUIPMENTS nEntrustEquipments)
        {
            repositoryEntrustEquipments.SaveOrUpdate(nEntrustEquipments, nEntrustEquipments.EEQ_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,

                data = MessageHelper.Get("10468", UserManager.Instance.User.Language),
                r = nEntrustEquipments
            });
        }

        [HttpPost]
        public string GetByEntrust([FromBody]int entrustid)
        {
            try
            {
                var entrustequipments = repositoryEntrustEquipments.GetByEntrust(entrustid);
                return JsonConvert.SerializeObject(new { status = 200, data = entrustequipments });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustEquipmentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var entrustequipments = repositoryEntrustEquipments.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = entrustequipments });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiEntrustEquipmentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryEntrustEquipments.DeleteById(id);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10469", UserManager.Instance.User.Language) });
        }

    }
}