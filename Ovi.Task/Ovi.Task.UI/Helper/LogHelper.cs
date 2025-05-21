using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.CustomExceptions;
using Ovi.Task.Helper.User;
using System;
using System.IO;
using System.Linq;
using System.Web;

namespace Ovi.Task.UI.Helper
{
    public class LogHelper
    {
        private static readonly string LogFilePath = HttpContext.Current.Server.MapPath("~/Logs/TMS_Logs.txt");

        public static void LogToDb(Exception e, OviUser user, string bunit, string bfunc)
        {
            try
            {
                if (user == null)
                    return;

                var exceptionMsgs = e.FromHierarchy(ex => ex.InnerException).Select(ex => ex.ToString());
                var repositoryLogs = new RepositoryLogs();
                repositoryLogs.SaveOrUpdate(new TMLOGS
                {
                    TML_BUNIT = bunit,
                    TML_BFUNC = bfunc,
                    TML_CREATED = DateTime.Now,
                    TML_CREATEDBY = user.Code,
                    TML_MSG = e.Message,
                    TML_DETAILS = string.Join(Environment.NewLine, exceptionMsgs),
                    TML_RECORDVERSION =  0
                }, true);
            }
            catch
            {
                throw new Exception("DB Log Failed");
            }
        }

        public static void LogToFile(string message)
        {
            try
            {
                string logFilePath = GetLogFilePath(); 
                string logEntry = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}";

                System.IO.File.AppendAllText(logFilePath, logEntry + Environment.NewLine); // Satırı ekle
            }
            catch
            {
            }
        }

        private static string GetLogFilePath()
        {
            string logDirectory = HttpContext.Current.Server.MapPath("~/Logs/");

            if (!System.IO.Directory.Exists(logDirectory))
            {
                System.IO.Directory.CreateDirectory(logDirectory); 
            }

            string logFileName = $"TMS_Logs_{DateTime.Now:yyyy-MM-dd}.txt"; 
            return System.IO.Path.Combine(logDirectory, logFileName);
        }

    }
}