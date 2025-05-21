using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Ovi.Task.Data.Configuration;

namespace Ovi.Task.UI.Api
{
    public class ApiRateTaskController : ApiController
    {
        private RepositoryTasks repositoryTasks;

        public class Task
        {
            public long Id { get; set; }
        }

        public ApiRateTaskController()
        {
            repositoryTasks = new RepositoryTasks();
        }


        [HttpPost]
        public string Get(Task tsk)
        {
            try
            {
                var task = repositoryTasks.Get(tsk.Id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = task
                });
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpPost]
        [Transaction]
        public string SaveRating(TMTASKS task)
        {

            var taskOnDb = repositoryTasks.Get(task.TSK_ID);
            if (taskOnDb.TSK_RATING.HasValue)
                throw new TmsException(MessageHelper.GetNonSpecificErrMsg("TR"));

            repositoryTasks.SaveOrUpdate(task, task.TSK_ID == 0);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10429", "TR") });

        }
    }
}