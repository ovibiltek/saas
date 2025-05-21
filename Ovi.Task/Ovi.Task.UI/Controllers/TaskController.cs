using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class TaskController : BaseController
    {
        public ActionResult List(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult Activities(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult New(string type)
        {
            if (!string.IsNullOrEmpty(type))
            {
                var repositoryTypes = new RepositoryTypes();
                var typeo = repositoryTypes.Get(new TMTYPES { TYP_ENTITY = "TASK", TYP_CODE = type });

                if (typeo != null)
                {
                    ViewBag.TypeCode = typeo.TYP_CODE;
                    ViewBag.TypeDesc = typeo.TYP_DESCF;
                }
            }
            return View("Record");
        }

        public ActionResult FastCreate()
        {
            return View();
        }

        public ActionResult Record(long? id)
        {
            return View();
        }

        public ActionResult ListPerformance(string id)
        {
            ViewBag.id = id;
            return View("list/List");
        }

        public ActionResult TaskAmounts(string id)
        {
            ViewBag.id = id;
            return View("list/TaskAmounts");
        }

        public ActionResult TaskAmountsM1(string id)
        {
            ViewBag.id = id;
            return View("list/TaskAmountsM1");
        }

        public ActionResult TaskRatings(string id)
        {
            ViewBag.id = id;
            return View("list/TaskRatings");
        }
    }
}