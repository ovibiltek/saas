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
    public class ApiConfirmationsController : ApiController
    {
        private RepositoryConfirmations repositoryConfirmation;
      

        public ApiConfirmationsController()
        {
            repositoryConfirmation = new RepositoryConfirmations();
          
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = gridRequest.action == "CNT"
                    ? (object)RepositoryShared<TMCONFIRMATIONS>.Count(gridRequest)
                    : repositoryConfirmation.List(gridRequest);

                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiConfirmationController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(TMCONFIRMATIONS nConf)
        {
            repositoryConfirmation.SaveOrUpdate(nConf);
            

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10134", UserManager.Instance.User.Language),
                r = nConf
            });
        }

        [HttpPost]
        public string Get([FromBody]int id)
        {
            try
            {
                var conf = repositoryConfirmation.Get(id);
                return JsonConvert.SerializeObject(new { status = 200, data = conf });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiConfirmationController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ValidateConfirmation([FromBody]int id)
        {
            try
            {
                repositoryConfirmation.ValidateConfirmation(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10136", UserManager.Instance.User.Language),
                    r = repositoryConfirmation.Get(id)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiConfirmationController", "ValidateConfirmation");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10086", UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]int id)
        {
            repositoryConfirmation.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10135", UserManager.Instance.User.Language)
            });
        }

        
    }
}