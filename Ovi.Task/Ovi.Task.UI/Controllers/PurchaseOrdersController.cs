using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class PurchaseOrdersController : BaseController
    {
        // GET: PurchaseOrders
        public ActionResult Index(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult NewByQuotation(long quo)
        {
            return View("Requisition");
        }

        public ActionResult NewByTask(long task, long? activity)
        {
            return View("Requisition");
        }

        public ActionResult List()
        {
            return View();
        }

        public ActionResult ListByTask(long id)
        {
            return View("Requisition");
        }

        public ActionResult ListByQuotation(long id)
        {
            return View("Requisition");
        }

        public ActionResult OrdersByTask(long id)
        {
            return View("Index");
        }

        public ActionResult OrdersByQuotation(long id)
        {
            return View("Index");
        }  

        public ActionResult Requisition(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult RequisitionToPO()
        {
            return View();
        }

        public ActionResult PurchaseOrdersToWarehouse(string id)
        {
            ViewBag.id = id;
            return View();
        }

        public ActionResult RequisitionListWithOrder()
        {
            return View();
        }
    }
}