using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class SupervisionController : BaseController
    {
        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult ListByTask(string id)
        {
            return View("Index");
        }

        public ActionResult NewByTask(long task, long? activity)
        {
            return View("Index");
        }

        public ActionResult NewByTaskRating(long task, long? activity)
        {
            return View("Index");
        }
    }
}