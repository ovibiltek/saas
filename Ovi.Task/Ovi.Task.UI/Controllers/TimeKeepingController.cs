using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class TimeKeepingController : BaseController
    {
        //
        // GET: /Inbox/

        public ActionResult Lines()
        {
            return View();
        }

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }
    }
}