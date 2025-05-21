using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class ReportBaseController : Controller
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {

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
                        filterContext.Result =
                        (filterContext.HttpContext.Request.Url != null &&
                         filterContext.HttpContext.Request.Url.AbsolutePath != "/")
                            ? new RedirectResult("/login?path=" + filterContext.HttpContext.Request.Url.AbsolutePath)
                            : new RedirectResult("/login");
                }
            }


        }

        protected override void OnException(ExceptionContext filterContext)
        {
            var exception = filterContext.Exception;
            //Logging the Exception
            filterContext.ExceptionHandled = true;

            var Result = View("ErrorReport", new HandleErrorInfo(exception,
                filterContext.RouteData.Values["controller"].ToString(),
                filterContext.RouteData.Values["action"].ToString()));

            filterContext.Result = Result;
        }
    }
}