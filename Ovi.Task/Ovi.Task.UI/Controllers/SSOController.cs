using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Newtonsoft.Json;
using Ovi.Task.UI.Helper;
using Ovi.Task.Data.Repositories;
using NPOI.SS.Formula.Functions;


namespace Ovi.Task.UI.Helper
{
    public class TokenResponse
    {
        [JsonProperty("id_token")]
        public string IdToken { get; set; }
    }

    public class UserInfo
    {
        public string Username { get; set; }
        public string EMail { get; set; }

    }

    public class SSOController : Controller
    {
        private static readonly string Issuer = WebConfigurationManager.AppSettings["SSO:Issuer"];
        private static readonly string AuthEndpoint = WebConfigurationManager.AppSettings["SSO:AuthEndpoint"];
        private static readonly string TokenEndpoint = WebConfigurationManager.AppSettings["SSO:TokenEndpoint"];
        private static readonly string UserInfoEndpoint = WebConfigurationManager.AppSettings["SSO:UserInfoEndpoint"];
        private static readonly string JwksUri = WebConfigurationManager.AppSettings["SSO:JwksUri"];
        private static readonly string ClientId = WebConfigurationManager.AppSettings["SSO:ClientId"];
        private static readonly string ClientSecret = WebConfigurationManager.AppSettings["SSO:ClientSecret"];
        private static readonly string RedirectUri = WebConfigurationManager.AppSettings["SSO:RedirectUri"];

        private RepositoryUsers repositoryUsers;
        private UserService userService;

        public SSOController()
        {
            repositoryUsers = new RepositoryUsers();
            userService = new UserService();
        }

        public ActionResult Login()
        {
            string loginUrl = $"{AuthEndpoint}?response_type=code&client_id={ClientId}&redirect_uri={Uri.EscapeDataString(RedirectUri)}&scope=openid";
            LogHelper.LogToFile($"Redirect To: {loginUrl}");
            return Redirect(loginUrl);
        }

        public ActionResult Callback(string code)
        {
            LogHelper.LogToFile($"SSO Callback Triggered - Code Received: {code}");

            if (string.IsNullOrEmpty(code))
            {
                LogHelper.LogToFile("SSO Callback Error: No Authorization Code Received");
                return RedirectToAction("Index", "Login");
            }

            // SsoHelper üzerinden token alıyoruz.
            var tokenResponse = SsoHelper.GetToken(code, TokenEndpoint, ClientId, ClientSecret, RedirectUri);
            if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.IdToken))
            {
                LogHelper.LogToFile("SSO Callback Error: No ID Token Received");
                return RedirectToAction("Index", "Login");
            }

            LogHelper.LogToFile($"SSO Callback - ID Token Received: {tokenResponse.IdToken.Substring(0, 50)}... (truncated)");

            // SsoHelper üzerinden token doğrulama işlemi
            var userInfo = SsoHelper.ValidateIdToken(tokenResponse.IdToken, JwksUri, Issuer, ClientId);
            if (userInfo != null)
            {
                LogHelper.LogToFile($"User Authenticated: {userInfo.Username}");

                var user = repositoryUsers.Get(userInfo.Username.ToUpperInvariant());
                if (user == null)
                {
                    LogHelper.LogToFile($"User Not Found: {userInfo.Username}");
                    LogHelper.LogToFile($"Finding User By Email: {userInfo.EMail}");
                    user = repositoryUsers.GetUserByEMail(userInfo.EMail);
                    if (user == null)
                    {
                        LogHelper.LogToFile($"User {userInfo.Username} not found in system(Username+EMail). Redirecting to Login.");
                        return RedirectToAction("Index", "Login");
                    }     
                }

                var tmsUser = userService.GetUser(user.USR_CODE);
                if (UserManager.Instance.CreateFormsAuthenticationCookie(tmsUser))
                {
                    LogHelper.LogToFile($"User {userInfo.Username} successfully validated.");

                    user.USR_LOCKCOUNT = 0;
                    repositoryUsers.SaveOrUpdate(user);

                    WebAppHelper.PostLoginOp(tmsUser);

                    string redirectPage = string.IsNullOrEmpty(UserManager.Instance.User.Customer) ? "/Main/Index" : "/Main/Customer";

                    LogHelper.LogToFile($"Redirecting user {userInfo.Username} to {redirectPage}");
                    return Redirect(redirectPage);
                }
                else
                {
                    LogHelper.LogToFile($"User {userInfo.Username} validation failed.");
                    return RedirectToAction("Index", "Login");
                }
            }

            LogHelper.LogToFile("SSO Callback Error: Failed to Validate ID Token");
            return RedirectToAction("Index", "Login");
        }
    }
}
