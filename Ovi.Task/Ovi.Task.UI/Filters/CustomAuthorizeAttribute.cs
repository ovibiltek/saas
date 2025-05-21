using Newtonsoft.Json;
using Ovi.Task.UI.Helper;
using System;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Ovi.Task.UI.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CustomAuthorizeAttribute : ActionFilterAttribute, IActionFilter
    {
        public override void OnActionExecuted(HttpActionExecutedContext aec)
        {
            base.OnActionExecuted(aec);
            if (UserManager.Instance.User != null || aec.Request.RequestUri.AbsolutePath == "/Api/ApiLogin/Check") return;
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