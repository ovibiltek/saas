using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Web;
using ICSharpCode.SharpZipLib.Zip;
using Ovi.Task.Helper.Shared;
using System.Web.Configuration;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.UI
{
    /// <summary>
    /// Summary description for File
    /// </summary>
    public class Download : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            if (UserManager.Instance.User == null)
                throw new Exception("Session is invalid");
            if (context.Request.QueryString.Count <= 0) return;

            var subject = context.Request.QueryString["subject"];
            var source = context.Request.QueryString["source"];

            var repositoryDocuments = new RepositoryDocuments();
            var docs = repositoryDocuments.List(subject, source);

            DownloadAsZip(context, source, docs);
        }

        public void DownloadAsZip(HttpContext context, string source, IList<TMDOCSMETA> zipFiles)
        {
            if (zipFiles != null && zipFiles.Count > 0)
            {
                context.Response.Clear();
                context.Response.ContentType = "application/zip";
                context.Response.AppendHeader("content-disposition", string.Format("attachment;filename={0}.zip", source));
                context.Response.BufferOutput = false;

                using (var zipOutput = new ZipOutputStream(context.Response.OutputStream))
                {
                    zipOutput.SetLevel(9); // No compression
                    zipOutput.UseZip64 = UseZip64.Off;
                    zipOutput.IsStreamOwner = false; 
                    
                    var crc = new ICSharpCode.SharpZipLib.Checksum.Crc32();
                    foreach (var file in zipFiles)
                    {
                        var filecontent = FileHelper.ReadFile(file.DOC_PATH, true);
                        var zipEntry = new ZipEntry(string.Format(@"{0}/", source) + string.Format("{0}_{1}_{2}", file.DOC_CREATED.ToString(OviShared.LongDate), file.DOC_CREATEDBY , ZipEntry.CleanName(file.DOC_OFN))) { DateTime = DateTime.Now, Size = filecontent.Length };
                        crc.Reset();
                        crc.Update(filecontent);
                        zipEntry.Crc = crc.Value;
                        zipOutput.PutNextEntry(zipEntry);
                        zipOutput.Write(filecontent, 0, filecontent.Length);
                        zipOutput.CloseEntry();
                    }
                   
                    zipOutput.Flush();
                    zipOutput.Finish();
                    zipOutput.Close();
                }

                HttpContext.Current.ApplicationInstance.CompleteRequest();
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