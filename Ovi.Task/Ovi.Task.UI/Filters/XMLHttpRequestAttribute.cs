using Newtonsoft.Json;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Ovi.Task.UI.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class XMLHttpRequestAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext aec)
        {
            if (UserManager.Instance.User != null)
            {
                var repositorySessions = new RepositorySessions();
                var currsess = repositorySessions.GetBySessId(UserManager.Instance.User.SessionId);

                if ((currsess != null) || aec.Request.RequestUri.AbsolutePath == "/ApiLogin/Check") return;
            }

            var request = aec.Request;
            var response = aec.Response;
            var rw = ((string[])request.Headers.GetValues("X-Requested-With"))[0];
            switch (rw)
            {
                case "XMLHttpRequest":
                    var objectContent = response.Content as ObjectContent;
                    if (objectContent != null)
                        objectContent.Value = JsonConvert.SerializeObject(new { status = 300, data = "User information is not valid" });
                    break;
            }
        }
    }
}