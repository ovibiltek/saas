using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System;
using System.Configuration;
using System.Globalization;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace Ovi.Task.UI.Controllers
{
    public class LoginParams
    {
        public string CustomLogo { get; set; }
        public string AppTitle { get; set; }
    }

    public class LoginController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {

            var lp = new LoginParams();


            if (UserManager.Instance.User != null)
            {
                var repositorySessions = new RepositorySessions();
                var currsess = repositorySessions.GetBySessId(UserManager.Instance.User.SessionId);

                if (currsess != null)
                    repositorySessions.DeleteById(currsess.TMS_ID);

                UserManager.Instance.Logoff();
              
            }

            // Kültür bilgisi ayarla
            CultureInfo culture = CultureInfo.GetCultureInfo("TR");
            var lang = Request.Cookies["culture"];
            if (lang != null)
                culture = CultureInfo.GetCultureInfo(lang.Value);

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;

            // Özelleştirilmiş logo ve başlık değerlerini al
            var repositoryParameters = new RepositoryParameters();
            var customlogo = repositoryParameters.Get("LGNCUSTLOGO");
            var apptitle = repositoryParameters.Get("APPTITLE");

            lp.CustomLogo = customlogo != null ? customlogo.PRM_VALUE : null;
            lp.AppTitle = apptitle != null ? apptitle.PRM_VALUE : "TMS - Task Management System";

            return View(lp);
        }
    }
}
