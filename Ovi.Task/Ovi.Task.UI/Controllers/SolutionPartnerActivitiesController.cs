using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class SolutionPartnerActivitiesController:BaseController
    {
        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }
    }
}