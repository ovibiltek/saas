using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class ToDoController : BaseController
    {
        public ActionResult List(string id)
        {
            return View();
        }
    }
}