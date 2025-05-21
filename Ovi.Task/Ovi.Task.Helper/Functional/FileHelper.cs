using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace Ovi.Task.Helper.Functional
{
    public class FileHelper
    {
        public static void CreateFile(string fileName, bool addContentFolderPrefix, byte[] fileData)
        {
            try
            {
                FileInfo fInfo = null;
                var contentfolder = WebConfigurationManager.AppSettings["contentfolder"];
                var filepath = addContentFolderPrefix ? string.Format("{0}\\{1}", contentfolder, fileName) : fileName;
                fInfo = new FileInfo(filepath);
               
                if (!Directory.Exists(fInfo.Directory.FullName))
                    Directory.CreateDirectory(fInfo.Directory.FullName);

                File.WriteAllBytes(filepath, fileData);

            }
            catch (Exception)
            {
                throw;
            }
        }

        public static byte[] ReadFile(string fileName, bool addContentFolderPrefix)
        {
            try
            {
                var contentfolder = WebConfigurationManager.AppSettings["contentfolder"];
                var filepath = addContentFolderPrefix ? string.Format("{0}\\{1}", contentfolder, fileName) : fileName;
                var filecontent = System.IO.File.ReadAllBytes(filepath);
                return filecontent;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static byte[] ReadFileIfPossible(string fileName, bool addContentFolderPrefix)
        {
            try
            {
                var contentfolder = WebConfigurationManager.AppSettings["contentfolder"];
                var filepath = addContentFolderPrefix ? string.Format("{0}\\{1}", contentfolder, fileName) : fileName;
                var filecontent = System.IO.File.ReadAllBytes(filepath);
                return filecontent;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static void DeleteFile(string fileName, bool addContentFolderPrefix)
        {
            try
            {
                var contentfolder = WebConfigurationManager.AppSettings["contentfolder"];
                var filepath = addContentFolderPrefix ? string.Format("{0}\\{1}", contentfolder, fileName) : fileName;
                File.Delete(filepath);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
