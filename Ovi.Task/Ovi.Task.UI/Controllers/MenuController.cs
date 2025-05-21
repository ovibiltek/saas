using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class MenuController : BaseController
    {
        //
        // GET: /Menu/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Configuration()
        {
            return View();
        }
    }
}