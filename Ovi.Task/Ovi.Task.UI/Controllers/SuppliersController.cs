using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class SuppliersController : BaseController
    {
        //
        // GET: /Audit/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult SupplierTaskTypes(string id)
        {
            ViewBag.id = id;
            return View("list/SupplierTaskTypes");
        }
    }
}