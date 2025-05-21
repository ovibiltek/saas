using System;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using file = System.IO.File;
using System.Text;

namespace Ovi.Task.UI.Controllers
{
    public class BaseController : Controller
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            LoadCustomScriptFile(filterContext);
            base.OnActionExecuting(filterContext);

            if (UserManager.Instance.User == null || UserManager.Instance.User.Code == null)
            {
                if (!(filterContext.Controller is LoginController))
                {
                    filterContext.Result = (filterContext.HttpContext.Request.Url != null && filterContext.HttpContext.Request.Url.AbsolutePath != "/") ? new RedirectResult("/login?path=" + filterContext.HttpContext.Request.Url.AbsolutePath) : new RedirectResult("/login");
                    return;
                }
            }

            var repositorySessions = new RepositorySessions();
            if (UserManager.Instance.User != null)
            {
                var currsess = repositorySessions.GetBySessId(UserManager.Instance.User.SessionId);

                if (currsess == null)
                {
                    if (!(filterContext.Controller is LoginController))
                    {
                        filterContext.Result = (filterContext.HttpContext.Request.Url != null && filterContext.HttpContext.Request.Url.AbsolutePath != "/") ? new RedirectResult("/login?path=" + filterContext.HttpContext.Request.Url.AbsolutePath) : new RedirectResult("/login");
                        return;
                    }
                }
            }

            var controller = filterContext.Controller.GetType().Name;
            var action = filterContext.ActionDescriptor.ActionName;
            if (UserManager.Instance.User != null)
            {
                var menu = MenuItemHelper.GetMenuItems(UserManager.Instance.User.Code, false);
                var screens = MenuItemHelper.GetScreens();

                var scr = screens.FirstOrDefault(x => x.SCR_CONTROLLER == string.Format("{0}.{1}", controller, action));
                if (scr == null || !menu.Contains(scr.SCR_CODE))
                {
                    filterContext.Result = (filterContext.HttpContext.Request.Url != null && filterContext.HttpContext.Request.Url.AbsolutePath != "/") ? new RedirectResult("/login?path=" + filterContext.HttpContext.Request.Url.AbsolutePath) : new RedirectResult("/login");
                }
                else
                {
                     var parameters = new RepositoryParameters().List(
                        new GridRequest
                        {
                            filter = new GridFilters
                            {
                                Filters = new List<GridFilter>() { new GridFilter { Field = "PRM_ISENCRYPTED", Value = "+", Operator = "neq" } }
                            }
                        }).Select(p => new KeyValuePair<string, string>(p.PRM_CODE, p.PRM_VALUE)).ToArray();


                    filterContext.Controller.ViewBag.Parameters = parameters;
                    var mapskey = new RepositoryParameters().Get("GOOGLEMAPSKEY");
                    var apptitle = new RepositoryParameters().Get("APPTITLE");

                    filterContext.Controller.ViewBag.screen = scr.SCR_CODE;
                    filterContext.Controller.ViewBag.hasguide = scr.SCR_HASGUIDE;
                    filterContext.Controller.ViewBag.GOOGLEMAPSKEY = mapskey != null ? mapskey.PRM_VALUE : string.Empty;
                    filterContext.Controller.ViewBag.APPTITLE = apptitle != null ? Encoding.UTF8.GetString(Encoding.Default.GetBytes(apptitle.PRM_VALUE)) : "TMS - Task Management System";

                }
            }
        }

        private void LoadCustomScriptFile(ActionExecutingContext filterContext)
        {
            var controllerName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;
            var actionname = filterContext.ActionDescriptor.ActionName;
            var path = string.Format(@"/Scripts/app/custom/{0}_{1}.js", controllerName, actionname);
            var customscriptfilepath = Server.MapPath(path);
            if (file.Exists(customscriptfilepath))
            {
                filterContext.Controller.ViewBag.CustomScript = path;
            }
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            var exception = filterContext.Exception;

            //Logging the Exception
            filterContext.ExceptionHandled = true;

            var Result = View("Error", new HandleErrorInfo(exception,
                filterContext.RouteData.Values["controller"].ToString(),
                filterContext.RouteData.Values["action"].ToString()));

            filterContext.Result = Result;
        }
    }
}