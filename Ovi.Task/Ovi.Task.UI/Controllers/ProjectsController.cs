using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class ProjectsController : BaseController
    {
        //
        // GET: /Projects/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult Record(string id)
        {
            ViewBag.project = id;
            return View("Index");
        }
    }
}