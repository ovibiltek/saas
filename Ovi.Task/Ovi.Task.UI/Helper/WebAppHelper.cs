using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static Ovi.Task.UI.Api.ApiLoginController;

namespace Ovi.Task.UI.Helper
{
    public class WebAppHelper
    {

        public static void PostLoginOp(OviUser user)
        {
            SaveCultureCookie(user);
            SaveSession(user);
        }

        private static void SaveCultureCookie(OviUser user)
        {
            var httpCookie = HttpContext.Current.Response.Cookies["culture"];
            if (httpCookie != null)
            {
                httpCookie.Value = user.Culture;
            }
            else
            {
                HttpContext.Current.Response.Cookies.Add(new HttpCookie("culture", UserManager.Instance.User.Culture));
            }
        }

        private static void SaveSession(OviUser user)
        {
            var ip = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            var aip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];

            var repositorySessions = new RepositorySessions();
            repositorySessions.SaveOrUpdate(new TMSESSIONS
            {
                TMS_IP = !string.IsNullOrEmpty(ip) ? ip.Split(',')[0] : aip,
                TMS_SESSPRODUCTID = 1,
                TMS_LOGIN = DateTime.Now,
                TMS_SESSUSER = user.Code,
                TMS_SESSID = user.SessionId,
                TMS_BROWSER = string.Format("{0}-{1}-{2}-{3}",
                    HttpContext.Current.Request.Browser.Platform,
                    HttpContext.Current.Request.Browser.Type,
                    HttpContext.Current.Request.Browser.Version,
                    HttpContext.Current.Request.Browser.MajorVersion)
            });
        }

    }
}