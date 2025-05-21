using System;
using System.Globalization;
using System.Threading;
using System.Web.Mvc;
using System.Web.Routing;

namespace Ovi.Task.UI.Helper
{
    public class CultureAwareControllerActivator : IControllerActivator
    {
        public IController Create(RequestContext requestContext, Type controllerType)
        {
            //Get the {language} parameter in the RouteData
            var language = (UserManager.Instance.User != null && UserManager.Instance.User.Language != null)
                ? UserManager.Instance.User.Language.ToLower()
                : "en";

            //Get the culture info of the language code
            var culture = CultureInfo.GetCultureInfo(language);
            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;
            return DependencyResolver.Current.GetService(controllerType) as IController;
        }
    }
}