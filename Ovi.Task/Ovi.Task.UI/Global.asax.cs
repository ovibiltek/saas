using Newtonsoft.Json;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Helper;
using Ovi.Task.Helper.User;
using Ovi.Task.UI.Helper;
using System;
using System.Net;
using System.Security.Principal;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace Ovi.Task.UI
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode,
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {

            LogHelper.LogToFile("Setting Security Protocol to Tls12");
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            DbSettings.ConnectionString = WebConfigurationManager.ConnectionStrings["db"].ConnectionString;
            DbSettings.MailConfigurationDbConnectionString = WebConfigurationManager.ConnectionStrings["mcdb"].ConnectionString;
            DbSettings.MaxResultCount = 100;

            NHibernateConfigurationProperties.cache_provider_class = "NHibernate.Cache.NoCacheProvider";
            NHibernateConfigurationProperties.cache_use_second_level_cache = "false";
            NHibernateConfigurationProperties.cache_use_query_cache = "false";
            NHibernateConfigurationProperties.current_session_context_class = "web";
            NHibernateConfigurationProperties.command_timeout = "120";

            ControllerBuilder.Current.SetControllerFactory(new DefaultControllerFactory(new CultureAwareControllerActivator()));
            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
            json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.All;
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            var authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                // Get the forms authentication ticket.
                var authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                var identity = new GenericIdentity(authTicket.Name, "Forms");
                var principal = new OviPrincipal(identity);

                // Get the custom user data encrypted in the ticket.
                var userData = ((FormsIdentity)(HttpContext.Current.User.Identity)).Ticket.UserData;

                // Deserialize the json data and set it on the custom principal.
                principal.User = JsonConvert.DeserializeObject<OviUser>(userData);

                // Set the context user.
                HttpContext.Current.User = principal;
            }
        }

        protected void Application_Error()
        {
            var httpContext = HttpContext.Current;
            if (httpContext == null) return;
            if (httpContext.CurrentHandler is MvcHandler)
            {
                var requestContext = ((MvcHandler)httpContext.CurrentHandler).RequestContext;
                /* When the request is ajax the system can automatically handle a mistake with a JSON response. 
                       Then overwrites the default response */
                if (requestContext.HttpContext.Request.IsAjaxRequest())
                {
                    httpContext.Response.Clear();
                    var controllerName = requestContext.RouteData.GetRequiredString("controller");
                    var factory = ControllerBuilder.Current.GetControllerFactory();
                    var controller = factory.CreateController(requestContext, controllerName);
                    var controllerContext = new ControllerContext(requestContext, (ControllerBase)controller);

                    var jsonResult = new JsonResult
                    {
                        Data = new { success = false, serverError = "500" },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                    jsonResult.ExecuteResult(controllerContext);
                    httpContext.Response.End();
                }
            }
            else
            {
                var exception = HttpContext.Current.Error;
                Server.ClearError();
                Response.Redirect(string.Format("~/Error/Index/{0}", exception.Message), false);
                Context.ApplicationInstance.CompleteRequest();
            }
        }

    }
}