using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Helper;

namespace Ovi.Task.UI
{
    /// <summary>
    /// Summary description for File
    /// </summary>
    public class File : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (UserManager.Instance.User == null)
                throw new Exception("Session is invalid");
            if (context.Request.QueryString.Count <= 0)
                return;

            var id = long.Parse(context.Request.QueryString["id"]);
            var type = context.Request.QueryString["type"];
            var guid = context.Request.QueryString["guid"];
            var key = string.Format("{0}-{1}", (type ?? ""), id.ToString());
            var width = context.Request.QueryString["width"];
            var height = context.Request.QueryString["height"];

            if (type == "svg")
            {

                var repositoryTaskActivities = new RepositoryTaskActivities();
                var repositoryMobileDrawing = new RepositoryMobileDrawings();
                var taskActivity = repositoryTaskActivities.Get(id);
                var drawing = repositoryMobileDrawing.Get(new TMMOBILEDRAWINGS
                {
                    DRW_TASK = (int)taskActivity.TSA_TASK,
                    DRW_ACTIVITY = (int)taskActivity.TSA_LINE
                });
                var svgStr = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\r\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"640\" height=\"120\">\r\n</svg>";
                if (drawing != null) svgStr = drawing.DRW_DATA;
                var bytes = Encoding.UTF8.GetBytes(svgStr);
                context.Response.OutputStream.Write(bytes, 0, bytes.Length);
                context.Response.ContentType = "image/svg+xml";
                context.Response.End();
            }
            else
            {
                var repositoryDocuments = new RepositoryDocuments();
                var document = repositoryDocuments.Get(id);

                if (document.DOC_GUID != guid)
                    throw new Exception("Invalid guid");

                var isImage = new[] { "image/png", "image/jpeg" }.Contains(document.DOC_CONTENTTYPE);
                var filecontent = FileHelper.ReadFile(document.DOC_PATH, true);

                if (!isImage)
                {
                    context.Response.ContentType = document.DOC_CONTENTTYPE;
                    context.Response.AppendHeader("Content-Length", document.DOC_SIZE.ToString());
                    context.Response.AppendHeader("Content-Disposition", "attachment; filename=" + document.DOC_OFN);
                    context.Response.BinaryWrite(filecontent);
                    context.Response.End();
                }
                else
                {
                    var reqimage = (type == "thumbnail" ? MakeThumbnail(filecontent, int.Parse(width), int.Parse(height)) : filecontent);
                    context.Response.OutputStream.Write(reqimage, 0, reqimage.Length);
                    context.Response.ContentType = "image/jpeg";
                    context.Response.End();
                }
            }

        }

        private static byte[] MakeThumbnail(byte[] myImage, int thumbWidth, int thumbHeight)
        {
            using (var ms = new MemoryStream())
            using (var thumbnail = Image.FromStream(new MemoryStream(myImage)).GetThumbnailImage(thumbWidth, thumbHeight, null, new IntPtr()))
            {
                thumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                return ms.ToArray();
            }
        }

        private object TMDOCUMENTS(string arg)
        {
            throw new NotImplementedException();
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }
}