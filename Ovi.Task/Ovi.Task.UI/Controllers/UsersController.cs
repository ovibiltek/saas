using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class UsersController : BaseController
    {

        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult MyProfile()
        {
            return View();
        }

    }
}