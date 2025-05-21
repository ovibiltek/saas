using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class GridController : BaseController
    {
        public ActionResult Index(string scrcode)
        {
            ViewBag.ScrCode = scrcode;
            return View();
        }
    }
}