using System.IO;
using System.Web.Mvc;

namespace Ovi.Task.UI.Helper
{
    public static class JavascriptExtension
    {
        public static MvcHtmlString IncludeVersionedJs(this HtmlHelper helper, string filename)
        {
            var version = GetVersion(helper, filename);
            return MvcHtmlString.Create("<script type='text/javascript' src='" + filename + version + "'></script>");
        }

        public static MvcHtmlString IncludeVersionedCss(this HtmlHelper helper, string filename)
        {
            var version = GetVersion(helper, filename);
            return MvcHtmlString.Create("<link href=\"" + filename + version + "\" rel=\"stylesheet\" />");
        }

        private static string GetVersion(this HtmlHelper helper, string filename)
        {
            var context = helper.ViewContext.RequestContext.HttpContext;
            var physicalPath = context.Server.MapPath(filename);
            var version = "?v=" + new FileInfo(physicalPath).LastWriteTime.ToString("yyyyMMddHHmmss");
            return version;
        }
    }
}