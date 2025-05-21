using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
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
    public class ApiTaskActivityChecklistsController : ApiController
    {
        private RepositoryTaskActivityChecklists repositoryTaskActivityChecklists;
        private RepositoryParameters repositoryParameters;

        public ApiTaskActivityChecklistsController()
        {
            repositoryTaskActivityChecklists = new RepositoryTaskActivityChecklists();
            repositoryParameters = new RepositoryParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKACTIVITYCHECKLISTS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskActivityChecklists.List(gridRequest);
                        total = RepositoryShared<TMTASKACTIVITYCHECKLISTS>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityChecklistsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMTASKACTIVITYCHECKLISTS nTaskActivityCheckist)
        {
            repositoryTaskActivityChecklists.SaveOrUpdate(nTaskActivityCheckist);
            repositoryTaskActivityChecklists.CreateChecklist(new CreateChecklistParams(nTaskActivityCheckist.TAC_ID, nTaskActivityCheckist.TAC_CHKTMP, nTaskActivityCheckist.TAC_TASK, nTaskActivityCheckist.TAC_ACTIVITY));

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10689", UserManager.Instance.User.Language),
                r = nTaskActivityCheckist
            });
        }

        [HttpPost]
        [Transaction]
        public string Complete([FromBody] int id)
        {
            var tac = repositoryTaskActivityChecklists.Get(id);
            tac.TAC_COMPLETED = '+';
            tac.TAC_CHKLISTPROGRESS = 100;
            repositoryTaskActivityChecklists.SaveOrUpdate(tac);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10693", UserManager.Instance.User.Language),
                r = tac
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateChecklistProgress(TMTASKACTIVITYCHECKLISTS nTaskActivityCheckist)
        {
            var actChecklist = repositoryTaskActivityChecklists.Get(nTaskActivityCheckist.TAC_ID);
            actChecklist.TAC_CHKLISTPROGRESS = nTaskActivityCheckist.TAC_CHKLISTPROGRESS;
            repositoryTaskActivityChecklists.SaveOrUpdate(actChecklist);
            return JsonConvert.SerializeObject(new { status = 200, data = actChecklist });
        }

        [HttpPost]
        public string Get([FromBody] int id)
        {
            try
            {
                var taskActivityChecklist = repositoryTaskActivityChecklists.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = taskActivityChecklist });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivityChecklistsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody] int id)
        {
            repositoryTaskActivityChecklists.DeleteById(id);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10690", UserManager.Instance.User.Language)
            });
        }
    }
}