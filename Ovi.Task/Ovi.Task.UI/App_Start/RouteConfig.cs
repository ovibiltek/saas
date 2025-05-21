using System.Web.Mvc;
using System.Web.Routing;

namespace Ovi.Task.UI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute("NEWTASK", "Task/New/{type}", new { controller = "Task", action = "New", type = UrlParameter.Optional });
            routes.MapRoute("NEWQUOTATIONBYTASK", "Quotations/NewByTask/{task}/{activity}", new { controller = "Quotations", action = "NewByTask", activity = UrlParameter.Optional });
            routes.MapRoute("NEWQUOTATIONBYPROJECT", "Quotations/NewByProject/{project}", new { controller = "Quotations", action = "NewByProject", activity = UrlParameter.Optional });
            routes.MapRoute("NEWSUPERVISIONBYTASK", "Supervision/NewByTask/{task}", new { controller = "Supervision", action = "NewByTask", activity = UrlParameter.Optional });
            routes.MapRoute("NEWSUPERVISIONBYTASKRATING", "Supervision/NewByTaskRating/{task}", new { controller = "Supervision", action = "NewByTaskRating", activity = UrlParameter.Optional });
            routes.MapRoute("PURCHASEORDERBYQUOTATION", "PurchaseOrders/NewByQuotation/{quo}", new { controller = "PurchaseOrders", action = "NewByQuotation"});
            routes.MapRoute("PURCHASEORDERBYTASKACTIVITY", "PurchaseOrders/NewByTask/{task}/{activity}", new { controller = "PurchaseOrders", action = "NewByTask", activity = UrlParameter.Optional });
            routes.MapRoute("RATETASK", "Operation/RateTask/{guid}/{id}", new { controller = "Operation", action = "RateTask" });        
            routes.MapRoute("Default", "{controller}/{action}/{id}", new { controller = "Main", action = "Index", id = UrlParameter.Optional });

        }
    }
}