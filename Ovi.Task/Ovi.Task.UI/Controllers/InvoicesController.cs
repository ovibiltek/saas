using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class InvoicesController : BaseController
    {
        //
        // GET: /Audit/

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult SPInvoiceAmountList()
        {
            return View();
        }
    }
}