using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class MyCompanyController : BaseController
    {
        //
        // GET: /Audit/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }
    }
}