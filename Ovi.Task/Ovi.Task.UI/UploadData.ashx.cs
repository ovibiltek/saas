using Newtonsoft.Json;
using Ovi.Task.Data.Helper;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Ovi.Task.Data.DAO;

namespace Ovi.Task.UI
{
    /// <summary>
    /// Summary description for UploadFile
    /// </summary>
    public class UploadData : IHttpHandler
    {
        public class ProcessResult
        {
            public List<ErrLine> ErrLines { get; set; }
            public string Filename { get; set; }
            public string Message { get; set; }
            public string Id { get; set; }
            public string Type { get; set; }
        }

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Request.Files.Count <= 0)
                    return;

                if (UserManager.Instance.User == null)
                    throw new Exception("Session is invalid");

                context.Response.ContentType = "application/json";

                var id = context.Request.Form["Id"];
                var type = context.Request.Form["Type"];

                var processResults = new List<ProcessResult>();
                for (var i = 0; i < context.Request.Files.Count; i++)
                {
                    var file = context.Request.Files[i];
                    if (file.ContentLength <= 0)
                        continue;
                    var errLines = ProcessFile(file, type, id);
                    var processResult = new ProcessResult
                    {
                        Filename = file.FileName,
                        ErrLines = errLines,
                        Id = id,
                        Type = type
                    };

                    if (type.StartsWith("BEQP"))
                    {
                        processResult.Message = MessageHelper.Get("20233", UserManager.Instance.User.Language);
                    }
                    else { 
                        switch (type)
                        {
                            case "CPP":
                                processResult.Message = MessageHelper.Get("20058", UserManager.Instance.User.Language);
                                break;
                            case "BCPP":
                                processResult.Message = MessageHelper.Get("20058", UserManager.Instance.User.Language);
                                break;
                            case "BCOPP":
                                processResult.Message = MessageHelper.Get("20058", UserManager.Instance.User.Language);
                                break;
                            case "BSRC":
                                processResult.Message = MessageHelper.Get("10419", UserManager.Instance.User.Language);
                                break;
                            case "BCMP":
                                processResult.Message = MessageHelper.Get("20120", UserManager.Instance.User.Language);
                                break;
                            case "BCSC":
                                processResult.Message = MessageHelper.Get("20122", UserManager.Instance.User.Language);
                                break;
                            case "BBRN":
                                processResult.Message = MessageHelper.Get("20059", UserManager.Instance.User.Language);
                                break;
                            case "BTSK":
                                processResult.Message = MessageHelper.Get("20072", UserManager.Instance.User.Language);
                                break;
                            case "BPTP":
                                processResult.Message = MessageHelper.Get("20231", UserManager.Instance.User.Language);
                                break;
                            case "BLOC":
                                processResult.Message = MessageHelper.Get("20203", UserManager.Instance.User.Language);
                                break;
                            case "BUSR":
                                processResult.Message = MessageHelper.Get("20204", UserManager.Instance.User.Language);
                                break;
                            case "BTPR":
                                processResult.Message = MessageHelper.Get("20236", UserManager.Instance.User.Language);
                                break;
                            case "BDLT":
                                processResult.Message = MessageHelper.Get("20241", UserManager.Instance.User.Language);
                                break;
                            case "BPAR":
                                processResult.Message = MessageHelper.Get("20242", UserManager.Instance.User.Language);
                                break;
                            case "BQPR":
                                processResult.Message = MessageHelper.Get("20243", UserManager.Instance.User.Language);
                                break;
                        }
                    }
                    processResults.Add(processResult);
                }

                context.Response.Write(JsonConvert.SerializeObject(new {status = 200, data = processResults}));
            }
            catch (Exception exc)
            {
                context.Response.Write(JsonConvert.SerializeObject(new { status = 500, data = exc.Message }));
            }
        }

        private static List<ErrLine> ProcessFile(HttpPostedFile file, string type, string id)
        {
            var ext = Path.GetExtension(file.FileName);
            var xlslines = ExcelHelper.GetLines(file.InputStream, ext.ToLower());
            var lines = new List<string[]>();
            foreach (var line in xlslines)
                if (line.Count(x => !string.IsNullOrEmpty(x)) != 0)
                    lines.Add(line);

            var uh = new UploadHelper();
            return uh.Process(file.FileName,type, id, lines);
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