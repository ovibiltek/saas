using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        public ActionResult Index()
        {
            return View("Test");
        }

    }
}