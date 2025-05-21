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
    public class ApiCheckListSwitchController : ApiController
    {
        private RepositoryCheckListSwitch repositoryCheckListSwitch;

        public ApiCheckListSwitchController()
        {
            repositoryCheckListSwitch = new RepositoryCheckListSwitch();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var chklstswitch = repositoryCheckListSwitch.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = chklstswitch
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCheckListSwitchController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCHKSWITCH nChkSwitch)
        {
            long rid;
            switch (nChkSwitch.CHS_VALUE)
            {
                case '+':
                    nChkSwitch = repositoryCheckListSwitch.SaveOrUpdate(nChkSwitch);
                    rid = nChkSwitch.CHS_ID;
                    break;

                default:
                    repositoryCheckListSwitch.DeleteById(nChkSwitch.CHS_ID);
                    rid = 0;
                    break;
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = rid
            });
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryCheckListSwitch.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200
            });
        }
    }
}