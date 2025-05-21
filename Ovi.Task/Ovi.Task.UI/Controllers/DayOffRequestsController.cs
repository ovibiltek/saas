using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class DayOffRequestsController : BaseController
    {
        //
        // GET: /Projects/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }
    }
}