using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class StatusesController : BaseController
    {
        //
        // GET: /Organizations/

        public ActionResult Index()
        {
            ViewData["screen"] = "STATUSES";
            return View();
        }
    }
}