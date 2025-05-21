using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class QuotationsController : BaseController
    {
        //
        // GET: /Audit/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult ListByTask(string id)
        {
            return View("Index");
        }

        public ActionResult ListByProject(string id)
        {
            return View("Index");
        }

        public ActionResult NewByTask(long task, long? activity)
        {
            return View("Index");
        }

        public ActionResult NewByProject(long project)
        {
            return View("Index");
        }

        public ActionResult Record(string id)
        {
            return View("Index");
        }

        public ActionResult LineDetails(string id)
        {
            return View("LineDetails");
        }
    }
}