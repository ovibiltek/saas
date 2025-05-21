using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class InboxController : BaseController
    {
        //
        // GET: /Inbox/

        public ActionResult Index()
        {
            return View();
        }
    }
}