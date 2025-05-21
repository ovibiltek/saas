using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class MobileController : BaseController
    {
        //
        // GET: /Mobile/

        public ActionResult Index()
        {
            return View("Mobile");
        }

        public ActionResult Sessions()
        {
            return View();
        }
    }
}