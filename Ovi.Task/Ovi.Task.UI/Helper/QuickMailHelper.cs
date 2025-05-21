using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.UI.Helper
{

    public class QuickMailHelper
    {
        private sealed class FileInfo
        {
            public string ContentType { get; set; }
            public byte[] Data { get; set; }
            public string FileName { get; set; }
            public string Guid { get; set; }

        }

        private RepositoryMailParameters repositoryMailParameters;
        private RepositoryMails repositoryMails;
        private RepositoryDocuments repositoryDocuments;
        private int DefaultMailTemplate = 10001;

        public QuickMailHelper()
        {
            repositoryMailParameters = new RepositoryMailParameters();
            repositoryMails = new RepositoryMails();
            repositoryDocuments = new RepositoryDocuments();
        }

        public void MultipleMail(HttpFileCollection files, string to, string subject, string cc, string format, string content)
        {
            if (!string.IsNullOrEmpty(to))
            {
                var f = CreateFilesArray(files);
                var arrto = to.Split(',');
                for (var i = 0; i < arrto.Length; i++)
                {
                    var mail = repositoryMails.SaveOrUpdate(new TMMAILS
                    {
                        MA_SUBJECT = subject,
                        MA_TOMAIL = arrto[i],
                        MA_CC = !string.IsNullOrEmpty(cc) ? string.Join(";", cc.Split(',')) : null,
                        MA_TEMPLATEID = format!="X" ? int.Parse(format) : DefaultMailTemplate,
                        MA_CREATED = DateTime.Now,
                        MA_READ = '-',
                        MA_DOCS = (f != null && f.Count > 0) ? '+' : '-',
                        MA_ENTITY = "MAIL"
                    });
                    mail.MA_TABLEKEY = mail.MA_ID.ToString();
                    repositoryMails.SaveOrUpdate(mail);
                    repositoryMailParameters.SaveOrUpdate(new TMMAILPARAMS
                    {
                        PR_MAILID = mail.MA_ID,
                        PR_NAME = "P1",
                        PR_VALUE = content
                    });

                    if (f != null)
                    {

                        for (var j = 0; j < f.Count; j++)
                        {
                            var currentFile = f[j];
                            repositoryDocuments.SaveOrUpdate(new TMDOCSMETA
                            {
                                DOC_CONTENTTYPE = currentFile.ContentType,
                                DOC_SUBJECT = "MAIL",
                                DOC_SOURCE = mail.MA_ID.ToString(),
                                DOC_TYPE = null,
                                DOC_GUID = currentFile.Guid,
                                DOC_OFN = currentFile.FileName,
                                DOC_CREATED = DateTime.Now,
                                DOC_CREATEDBY = UserManager.Instance.User.Code,
                                DOC_SIZE = currentFile.Data.Length
                            });

                            var filepath = string.Format("{0}\\{1}\\{2}\\{3}", string.Format("TMSCONTENTS_{0}", DateTime.Now.Year.ToString()), "MAIL", mail.MA_ID.ToString(), currentFile.FileName);
                            FileHelper.CreateFile(filepath, true,currentFile.Data);
                        }
                    }
                }
            }
        }

        public void SingleMail(HttpFileCollection files, string to, string subject, string cc, string format, string content)
        {
            if (!string.IsNullOrEmpty(to))
            {
                var f = CreateFilesArray(files);
                var mail = repositoryMails.SaveOrUpdate(new TMMAILS
                {
                    MA_SUBJECT = subject,
                    MA_TOMAIL = string.Join(";", to.Split(',')),
                    MA_CC = !string.IsNullOrEmpty(cc) ? string.Join(";", cc.Split(',')) : null,
                    MA_TEMPLATEID = format != "X" ? int.Parse(format) : DefaultMailTemplate,
                    MA_CREATED = DateTime.Now,
                    MA_READ = '-',
                    MA_DOCS = (f!=null && f.Count > 0) ? '+' : '-',
                    MA_ENTITY = "MAIL"
                });
                mail.MA_TABLEKEY = mail.MA_ID.ToString();
                repositoryMails.SaveOrUpdate(mail);
                repositoryMailParameters.SaveOrUpdate(new TMMAILPARAMS
                {
                    PR_MAILID = mail.MA_ID,
                    PR_NAME = "P1",
                    PR_VALUE = content
                });
                if (f != null)
                {
                    for (var j = 0; j < f.Count; j++)
                    {
                        var currentFile = f[j];
                        repositoryDocuments.SaveOrUpdate(new TMDOCSMETA
                        {
                            DOC_CONTENTTYPE = currentFile.ContentType,
                            DOC_SUBJECT = "MAIL",
                            DOC_SOURCE = mail.MA_ID.ToString(),
                            DOC_SIZE = currentFile.Data.Length,
                            DOC_TYPE = null,
                            DOC_GUID = currentFile.Guid,
                            DOC_OFN = currentFile.FileName,
                            DOC_CREATED = DateTime.Now,
                            DOC_CREATEDBY = UserManager.Instance.User.Code
                        });

                        var filepath = string.Format("{0}\\{1}\\{2}\\{3}", string.Format("TMSCONTENTS_{0}", DateTime.Now.Year.ToString()), "MAIL", mail.MA_ID.ToString(), currentFile.FileName);
                        FileHelper.CreateFile(filepath, true, currentFile.Data);
                    }
                }
            }
        }

        private static byte[] ResizeImage(byte[] fileData)
        {
            var imageWidth = 1024;
            var imageHeight = 768;
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
                if (oImage.Width > imageWidth)
                {
                    var rImage = ImageHelper.ResizeImage(oImage, new Size { Width = imageWidth, Height = imageHeight });
                    var ms = new MemoryStream();
                    rImage.Save(ms, oImage.RawFormat);
                    fileData = ms.ToArray();
                }
            }
            return fileData;
        }

        private List<FileInfo> CreateFilesArray(HttpFileCollection files)
        {
            if (files != null)
            {
                var fileInfoList = new List<FileInfo>();
                for (var j = 0; j < files.Count; j++)
                {
                    var file = files[j];
                    if (file.ContentLength <= 0) continue;
                    var originalFileName = Path.GetFileName(file.FileName);
                    var guid = UniqueStringId.Generate();
                    var contenttype = file.ContentType;
                    byte[] fileData;
                    using (var binaryReader = new BinaryReader(file.InputStream))
                        fileData = binaryReader.ReadBytes(file.ContentLength);
                    if (contenttype.StartsWith("image"))
                        fileData = ResizeImage(fileData);
                    fileInfoList.Add(new FileInfo
                    {
                        ContentType = contenttype,
                        Data = fileData,
                        Guid = guid,
                        FileName = originalFileName
                    });
                }
                return fileInfoList;
            }
            return null;
        }
    }
}