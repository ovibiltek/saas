using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiDocumentsController : ApiController
    {
        private RepositoryDocuments repositoryDocuments;

        public class CopyModel
        {
            public string Subject { get; set; }
            public string Source { get; set; }
            public string TargetSubject { get; set; }
            public string TargetSource { get; set; }
        }

        public class ClipBoardModel
        {
            public string Subject { get; set; }
            public string Source { get; set; }
            public string Data { get; set; }
        }


        public ApiDocumentsController()
        {
            repositoryDocuments = new RepositoryDocuments();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var lstOfDocuments = repositoryDocuments.ListDocumentPreviewInfo(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstOfDocuments
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDocumentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListQuick(DocumentModel docfilter)
        {
            try
            {
                var lstOfDocuments = repositoryDocuments.ListDocumentPreviewInfo(docfilter);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = lstOfDocuments
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiDocumentsController", "ListQuick");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            var document = repositoryDocuments.Get(id);
            repositoryDocuments.DeleteById(id);


            if (!document.DOC_LINK.HasValue)
                FileHelper.DeleteFile(document.DOC_PATH, true);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20016", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string CopyDocs(CopyModel copyModel)
        {
            if (!string.IsNullOrEmpty(copyModel.Source) && !string.IsNullOrEmpty(copyModel.Subject) && 
                !string.IsNullOrEmpty(copyModel.TargetSource) && !string.IsNullOrEmpty(copyModel.TargetSubject))
            {


                var docs = repositoryDocuments.List(copyModel.Subject, copyModel.Source).ToList();
                var targetDocs = repositoryDocuments.List(copyModel.TargetSubject, copyModel.TargetSource).ToList();

                docs.RemoveAll(item => targetDocs.Any(item2 => item.DOC_OFN == item2.DOC_OFN || new[]{ "video/3gpp", "video/mp4", "video/quicktime" }.Contains(item.DOC_TYPE)));

                foreach (var item in docs)
                {

                    var documentId = item.DOC_ID;
                    
                    item.DOC_ID = 0;
                    item.DOC_LINK = documentId;
                    item.DOC_SOURCE = copyModel.TargetSource;
                    item.DOC_SUBJECT = copyModel.TargetSubject;
                    item.DOC_CREATEDBY = UserManager.Instance.User.Code;
                    item.DOC_CREATED = DateTime.Now;

                    repositoryDocuments.SaveOrUpdate(item,true);

                }
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20225", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string CheckUncheckDocument(TMDOCCHECK docCheck)
        {
            docCheck.CHK_CREATED = DateTime.Now;
            docCheck.CHK_CREATEDBY = UserManager.Instance.User.Code;
            docCheck.CHK_UPDATED = DateTime.Now;
            docCheck.CHK_UPDATEDBY = UserManager.Instance.User.Code;

            repositoryDocuments.CheckUncheckDocument(docCheck);
            return JsonConvert.SerializeObject(new
            {
                status = 200
            });
        }



        [HttpPost]
        [Transaction]
        public string UploadFromClipboard(ClipBoardModel clipboard)
        {

            var contenttype = clipboard.Data.Split(';')[0].Replace("data:", "");
            byte[] imageBytes = Convert.FromBase64String(clipboard.Data.Split(',')[1]);
            // Convert byte[] to Image
            using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
            {
                Image image = Image.FromStream(ms, true);
                ImageHelper.Stamp(image, DateTime.Now, OviShared.LongDate);
                var imgbytes = image.ToByteArray(ImageFormat.Jpeg);
                var guid = UniqueStringId.Generate();

                var doc = repositoryDocuments.SaveOrUpdate(new TMDOCSMETA
                {
                    DOC_CONTENTTYPE = contenttype,
                    DOC_SUBJECT = clipboard.Subject,
                    DOC_SOURCE = clipboard.Source,
                    DOC_SIZE = imgbytes.Length,
                    DOC_TYPE = null,
                    DOC_GUID = guid,
                    DOC_OFN = $"{guid}.jpg",
                    DOC_CREATED = DateTime.Now,
                    DOC_CREATEDBY = UserManager.Instance.User.Code
                });

                var filepath = string.Format("{0}\\{1}\\{2}\\{3}", string.Format("TMSCONTENTS_{0}", DateTime.Now.Year.ToString()), clipboard.Subject, clipboard.Source, $"{guid}.jpg");
                FileHelper.CreateFile(filepath, true, imgbytes);

            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10023", UserManager.Instance.User.Language),
            });
        }

    }
}