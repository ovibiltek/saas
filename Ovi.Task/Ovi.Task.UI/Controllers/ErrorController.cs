using System;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Audit/

        public ActionResult Index(string id)
        {
            return View("Error",new HandleErrorInfo(new Exception(id),"Error","Index"));
        }
    }
}