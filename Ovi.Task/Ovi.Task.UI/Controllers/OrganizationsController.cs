using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class OrganizationsController : BaseController
    {
        //
        // GET: /Organizations/

        public ActionResult Index()
        {
            return View();
        }
    }
}