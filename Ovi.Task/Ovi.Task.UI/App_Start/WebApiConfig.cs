using System.Net.Http.Extensions.Compression.Core.Compressors;
using System.Web.Http;
using Microsoft.AspNet.WebApi.Extensions.Compression.Server;

namespace Ovi.Task.UI
{
    public static class WebApiConfig
    {
        public static string UrlPrefix { get { return "api"; } }
        public static string UrlPrefixRelative { get { return "~/api"; } }

        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute("Api1", "api/{controller}/{action}/{id}", new { id = RouteParameter.Optional });
            config.Routes.MapHttpRoute("Api2", "api/{controller}/{action}/{qs}", new { qs = RouteParameter.Optional });
            GlobalConfiguration.Configuration.MessageHandlers.Insert(0, new ServerCompressionHandler(new GZipCompressor(), new DeflateCompressor()));
        }
    }
}