using Newtonsoft.Json;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System;
using System.Data;
using System.Drawing;
using System.IO;
using System.Web;
using Ovi.Task.Data.Configuration;

namespace Ovi.Task.UI
{
    /// <summary>
    /// Summary description for UploadFile
    /// </summary>
    public class QuickMail : IHttpHandler
    {
        private QuickMailHelper quickMailHelper;

        public QuickMail()
        {
            quickMailHelper = new QuickMailHelper();
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                if (UserManager.Instance.User == null)
                    throw new Exception("Session is invalid");

                context.Response.ContentType = "application/json";

                var subject = context.Request.Form["Subject"];
                var content = HttpUtility.HtmlDecode(context.Request.Form["Content"]);
                var to = context.Request.Form["To"];
                var cc = context.Request.Form["Cc"];
                var format = context.Request.Form["Format"];
                var singlemail = context.Request.Form["SingleMail"];

                if (singlemail == "+")
                    quickMailHelper.SingleMail(context.Request.Files, to, subject, cc, format, content);
                else
                    quickMailHelper.MultipleMail(context.Request.Files, to, subject, cc, format, content);

                context.Response.Write(JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10412", UserManager.Instance.User.Language) }));
            }
            catch (Exception exc)
            {
                NHibernateSessionManager.Instance.RollbackTransaction();
                context.Response.Write(JsonConvert.SerializeObject(new { status = 500, data = exc.Message }));
            }
            finally
            {
                NHibernateSessionManager.Instance.CommitTransaction();
            }
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}