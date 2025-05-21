using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class ProgressPaymentsController : BaseController
    {
        //
        // GET: /Audit/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult ListInvoiceDetails()
        {
            return View();
        }
    }
}