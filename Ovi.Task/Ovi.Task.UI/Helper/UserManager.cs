using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.Helper.User;
using System;
using System.Web;
using System.Web.Security;
using static Google.Apis.Requests.BatchRequest;

namespace Ovi.Task.UI.Helper
{
    public sealed class UserManager
    {
        private readonly string menuSuffix = "_MENU";
        private readonly string screenSuffix = "_SCREEN";
        private readonly string inboxSuffix = "_INBOX";

        private static readonly object syncRoot = new object();
        private static UserManager _instance;

        public static UserManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (syncRoot)
                    {
                        if (_instance == null)
                            _instance = new UserManager();
                    }
                }
                return _instance;
            }
        }


        public OviUser User
        {
            get
            {
                if (HttpContext.Current.User.Identity.IsAuthenticated)
                    return ((OviPrincipal)(HttpContext.Current.User)).User;
                if (HttpContext.Current.Items.Contains("User"))
                    return (OviUser)HttpContext.Current.Items["User"];
                return null;

            }
        }

        public OviUser AuthenticateUser(string username, string password)
        {
            UserService usrService = new UserService();
            return usrService.AuthenticateUser(username, password) ? usrService.GetUser(username) : null;
        }

        public bool ValidateUser(string username, string password)
        {
            return Membership.ValidateUser(username, password);
        }

        public bool CreateFormsAuthenticationCookie(OviUser oviuser)
        {
            
            var userData = JsonConvert.SerializeObject(oviuser);
            var authTicket = new FormsAuthenticationTicket(1,
                oviuser.Code,
                DateTime.Now,
                DateTime.Now.AddMinutes(60),
                true,
                userData);

            var encryptedTicket = FormsAuthentication.Encrypt(authTicket);
            var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
            {
                Expires = authTicket.IsPersistent ? authTicket.Expiration : DateTime.MinValue
            };
            
            if (!HttpContext.Current.Items.Contains("User"))
                HttpContext.Current.Items.Add("User", oviuser);

            HttpContext.Current.Response.Cookies.Add(authCookie);
            return true;
        }

        public void Logoff()
        {
            FormsAuthentication.SignOut();
            ClearUserMemoryCache();
            ClearCookies();
        }

        private void ClearCookies()
        {
            var request = HttpContext.Current.Request;
            var response = HttpContext.Current.Response;

            if (request.Cookies != null)
            {
                foreach (string cookieName in request.Cookies.AllKeys)
                {
                    var expiredCookie = new HttpCookie(cookieName)
                    {
                        Expires = DateTime.Now.AddDays(-1),
                        Value = string.Empty
                    };
                    response.Cookies.Add(expiredCookie);
                }
            }

            // FormsAuthentication çerezini kesin olarak sil
            var formCookie = new HttpCookie(FormsAuthentication.FormsCookieName, "")
            {
                Expires = DateTime.Now.AddYears(-1),
                Path = FormsAuthentication.FormsCookiePath
            };
            response.Cookies.Add(formCookie);

            // Tüm Response çerezlerini temizle
            response.Cookies.Clear();
        }



        private void ClearUserMemoryCache()
        {
            var currentUser = User;
            if (currentUser != null)
            {
                string menukey = string.Concat(currentUser.Code, menuSuffix);
                string screenkey = string.Concat(currentUser.Code, screenSuffix);
                string inboxkey = string.Concat(currentUser.Code, inboxSuffix);

                CacheHelper.Instance.RemoveFromCache(menukey);
                CacheHelper.Instance.RemoveFromCache(screenkey);
                CacheHelper.Instance.RemoveFromCache(inboxkey);
            }
        }
    }
}
