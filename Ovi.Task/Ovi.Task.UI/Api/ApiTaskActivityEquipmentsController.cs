using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System.Collections.Generic;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTaskActivityEquipmentsController : ApiController
    {
        private RepositoryTaskActivityEquipments repositoryTaskActivityEquipments;

        public ApiTaskActivityEquipmentsController()
        {
            repositoryTaskActivityEquipments = new RepositoryTaskActivityEquipments();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
            object data;
            long total = 0;

            switch (gridRequest.action)
            {
                case "CNT":
                    data = RepositoryShared<TMTASKACTIVITYEQUIPMENTS>.Count(gridRequest);
                    total = 0;
                    break;

                default:
                    data = repositoryTaskActivityEquipments.List(gridRequest);
                    total = RepositoryShared<TMTASKACTIVITYEQUIPMENTS>.Count(gridRequest);
                    break;
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = data,
                total = total
            });
        }

        [HttpPost]
        [Transaction]
        public string Delete([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryTaskActivityEquipments.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10442", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTASKACTIVITYEQUIPMENTS mTaskActivityEquipment)
        {
            repositoryTaskActivityEquipments.SaveOrUpdate(mTaskActivityEquipment);


            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10441", UserManager.Instance.User.Language),
                r = mTaskActivityEquipment
            });
        }

        [HttpPost]
        [Transaction]
        public string SaveList(List<TMTASKACTIVITYEQUIPMENTS> mTaskActivityEquipment)
        {
            foreach (var activityEquipment in mTaskActivityEquipment)
            {
                repositoryTaskActivityEquipments.SaveOrUpdate(activityEquipment);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10441", UserManager.Instance.User.Language),
                r = mTaskActivityEquipment
            });
        }

    }
}