using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Repositories;
using Resources.Operation.Index;

namespace Ovi.Task.UI.Controllers
{
    public class OperationController : Controller
    {
        // GET: Operation
        public ActionResult RateTask(string guid, string id)
        {
            TMTASKS task = new TMTASKS();
            #region Language

            var lang = Request.Cookies["culture"];
            var culture = CultureInfo.GetCultureInfo("en-US");

            if (lang != null)
            {
                culture = CultureInfo.GetCultureInfo(lang.Value);
            }
            else // Browser Language
            {
                var cultures = Request.UserLanguages;
                //en veya tr
                if (cultures.Contains("tr-TR"))
                {
                    culture = CultureInfo.GetCultureInfo("tr-TR");
                }

            }

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;

            #endregion

            ModelState.Clear();

            var rating = new RepositoryMails().GetByGuidTask(guid, id);

            if (rating == null)
            {
                ModelState.AddModelError("", OperationStrings.taskNotFound);
            }
            else
            {
                task  = new RepositoryTasks().Get(Convert.ToInt64(id));

                if (task != null)
                {

                    var repositoryStatuses = new RepositoryStatuses();
                    var status = repositoryStatuses.Get(new TMSTATUSES
                    {
                        STA_ENTITY = "TASK",
                        STA_CODE = task.TSK_STATUS
                    });

                    if (status.STA_PCODE != "C" && task.TSK_STATUS != "TAM")
                        ModelState.AddModelError("", OperationStrings.notAvailableForRate);

                    if (task.TSK_RATING != null)
                        ModelState.AddModelError("", OperationStrings.alreadyRated);
                }
                else
                {
                    ModelState.AddModelError("", OperationStrings.taskNotFound);
                }
            }


            return View(task);
        }
    }
}