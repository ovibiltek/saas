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
using Ovi.Task.Helper.Shared;
using System.Collections.Generic;
using System.Web.Configuration;
using Ovi.Task.Helper.Functional;
using System.Linq;
using Ovi.Task.Data.Exceptions.Types;

namespace Ovi.Task.UI
{
    /// <summary>
    /// Summary description for UploadFile
    /// </summary>
    public class UploadFile : IHttpHandler
    {
        struct FileId
        {
            public long Id { get; set; }
            public string Guid { get; set; }

        }
        public void ProcessRequest(HttpContext context)
        {
            var repositoryDocuments = new RepositoryDocuments();
            var repositoryDocumentUploads = new RepositoryDocumentUploads();

            try
            {
                List<FileId> savedDocs = new List<FileId>();
                if (context.Request.Files.Count <= 0) return;
                if (UserManager.Instance.User == null)
                    throw new Exception("Session is invalid");

                context.Response.ContentType = "application/json";

                var source = context.Request.Form["DOC_SOURCE"];
                var subject = context.Request.Form["DOC_SUBJECT"];
                var type = context.Request.Form["DOC_TYPE"];

                if (context.Request.Files != null)
                {
                    long size = 0;

                    for (int i = 0; i < context.Request.Files.Count; i++)
                        size += context.Request.Files[i].ContentLength;

                    repositoryDocumentUploads.SaveOrUpdate(new TMDOCUMENTUPLOADS
                    {
                        DUP_SUBJECT = subject,
                        DUP_SOURCE = source,
                        DUP_SYSTEM = "TMS",
                        DUP_COUNT = context.Request.Files.Count,
                        DUP_SIZE = size,
                        DUP_UPLOADED = DateTime.Now,
                        DUP_UPLOADEDBY = UserManager.Instance.User.Code
                    });
                }

                NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                var listOfDocuments = repositoryDocuments.ListBySubjectAndSource(subject, source);

                for (var i = 0; i < context.Request.Files.Count; i++)
                {
                    var file = context.Request.Files[i];
                    if (file.ContentLength <= 0) continue;

                    var originalFileName = Path.GetFileName(file.FileName);
                    if (subject == "TASK" && listOfDocuments.Any(x => x.DOC_OFN == originalFileName))
                        continue;
                      

                    var guid = UniqueStringId.Generate();
                    var contenttype = file.ContentType;

                    byte[] fileData;
                    using (var binaryReader = new BinaryReader(file.InputStream))
                        fileData = binaryReader.ReadBytes(file.ContentLength);
                    if (contenttype.StartsWith("image"))
                        fileData = ResizeImage(fileData);

                    if (subject == "USER" && type == "PROFILFOTOGRAFI")
                        repositoryDocuments.DeleteDocument(source, subject, type);

                    var doc = repositoryDocuments.SaveOrUpdate(new TMDOCSMETA
                    {
                        DOC_CONTENTTYPE = contenttype,
                        DOC_SUBJECT = subject,
                        DOC_SOURCE = source,
                        DOC_SIZE = fileData.Length,
                        DOC_TYPE = (!string.IsNullOrEmpty(type) ? type : null),
                        DOC_GUID = guid,
                        DOC_OFN = originalFileName,
                        DOC_CREATED = DateTime.Now,
                        DOC_CREATEDBY = UserManager.Instance.User.Code
                    });

                    var filepath = string.Format("{0}\\{1}\\{2}\\{3}", string.Format("TMSCONTENTS_{0}", DateTime.Now.Year.ToString()), subject, source, originalFileName);
                    FileHelper.CreateFile(filepath, true, fileData);

                    savedDocs.Add(new FileId
                    {
                        Id = doc.DOC_ID,
                        Guid = doc.DOC_GUID
                    }); 
                    if (subject != "TASK") continue;

                    var repositoryNotifications = new RepositoryNotifications();
                    repositoryNotifications.SaveOrUpdate(new TMNOTIFICATIONS
                    {
                        NOT_TYPE = "NEWDOC",
                        NOT_CREATED = DateTime.Now,
                        NOT_CREATEDBY = UserManager.Instance.User.Code,
                        NOT_SUBJECT = subject,
                        NOT_DESC = string.Format("{0}", originalFileName),
                        NOT_READ = '-',
                        NOT_SOURCE = source
                    });
                }
                NHibernateSessionManager.Instance.CommitTransaction();
                context.Response.Write(JsonConvert.SerializeObject(new { 
                    status = 200, 
                    data = MessageHelper.Get("10023", UserManager.Instance.User.Language), 
                    source, 
                    subject,
                    ids = savedDocs
                }));
            }
            catch (Exception exc)
            {
                NHibernateSessionManager.Instance.RollbackTransaction();
                context.Response.Write(JsonConvert.SerializeObject(new { status = 500, data = exc.Message }));
            }
        }

        private static byte[] ResizeImage(byte[] fileData)
        {
            var imageWidth = 1280;
            var imageHeight = 1024;
            var repositoryParameters = new RepositoryParameters();
            var imgw = repositoryParameters.Get("IMGW");
            if (imgw != null)
                imageWidth = int.Parse(imgw.PRM_VALUE);
            var imgh = repositoryParameters.Get("IMGH");
            if (imgh != null)
                imageHeight = int.Parse(imgh.PRM_VALUE);
            using (var mso = new MemoryStream(fileData))
            {
                var oImage = Image.FromStream(mso);
                var fImage = oImage.Width > imageWidth && oImage.Height > imageHeight
                    ? ImageHelper.ResizeImage(oImage, new Size {Width = imageWidth, Height = imageHeight})
                    : oImage;
                ImageHelper.Stamp(fImage, DateTime.Now, OviShared.LongDate);
                var ms = new MemoryStream();
                fImage.Save(ms, oImage.RawFormat);
                fileData = ms.ToArray();
            }
            return fileData;
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