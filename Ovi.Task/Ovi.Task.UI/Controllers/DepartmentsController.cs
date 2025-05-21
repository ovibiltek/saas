using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class DepartmentsController : BaseController
    {
        //
        // GET: /Departments/

        public ActionResult Index()
        {
            return View();
        }
    }
}