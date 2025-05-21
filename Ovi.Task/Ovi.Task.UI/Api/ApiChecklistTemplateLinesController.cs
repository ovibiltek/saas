using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiChecklistTemplateLinesController : ApiController
    {

        public class ChecklistItem
        {
            public int Id { get; set; }
            public int? Rate { get; set; }
            public char Necessary { get; set; }
            public int? Duration { get; set; }
            public string Type { get; set; }
            public string Topic { get; set; }
            public string UpdateType { get; set; }
            public string Compare { get; set; }
        }

        private RepositoryCheckListTemplateLines repositoryCheckListTemplateLines;

        public ApiChecklistTemplateLinesController()
        {
            repositoryCheckListTemplateLines = new RepositoryCheckListTemplateLines();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var checklisttemplatelines = repositoryCheckListTemplateLines.List(gridRequest);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = checklisttemplatelines
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistTemplateLinesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCHECKLISTTEMPLATELINES nCheckListTemplateLine)
        {
            repositoryCheckListTemplateLines.SaveOrUpdate(nCheckListTemplateLine);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10042", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string Sync(TMCHECKLISTTEMPLATELINES pCheckListTemplateLine)
        {
            if (!string.IsNullOrEmpty(pCheckListTemplateLine.CHK_TEXT))
            {
                var oCheckListTemplateLine = repositoryCheckListTemplateLines.Get(pCheckListTemplateLine.CHK_ID);
                var nCheckListTemplateLine = (TMCHECKLISTTEMPLATELINES)oCheckListTemplateLine.Clone();

                nCheckListTemplateLine.CHK_UPDATED = pCheckListTemplateLine.CHK_UPDATED;
                nCheckListTemplateLine.CHK_UPDATEDBY = pCheckListTemplateLine.CHK_UPDATEDBY;
                nCheckListTemplateLine.CHK_TEXT = pCheckListTemplateLine.CHK_TEXT;

                repositoryCheckListTemplateLines.SaveOrUpdate(nCheckListTemplateLine);
            }
            else
            {
                repositoryCheckListTemplateLines.DeleteById(pCheckListTemplateLine.CHK_ID);
                repositoryCheckListTemplateLines.ReOrderChecklistItem(pCheckListTemplateLine.CHK_SUBJECT, pCheckListTemplateLine.CHK_SOURCE);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10042", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string MoveChecklistItem(RepositoryCheckListTemplateLines.ChecklistItem cli)
        {
            var oCheckListTemplateLine = repositoryCheckListTemplateLines.Get(cli.To);
            var nCheckListTemplateLine = (TMCHECKLISTTEMPLATELINES)oCheckListTemplateLine.Clone();
            nCheckListTemplateLine.CHK_NO = cli.ToOrder;

            repositoryCheckListTemplateLines.MoveChecklistItem(cli);

            return JsonConvert.SerializeObject(new
            {
                status = 200
            });
        }


        [HttpPost]
        [Transaction]
        public string UpdateCheckListItem(ChecklistItem chkline)
        {
            var checkListTemplateLine = repositoryCheckListTemplateLines.Get(chkline.Id);
            switch (chkline.UpdateType)
            {
                case "RATE":
                    checkListTemplateLine.CHK_RATE = chkline.Rate;
                    break;
                case "NECESSITY":
                    checkListTemplateLine.CHK_NECESSARY = chkline.Necessary;
                    break;
                case "ITEMTYPE":
                    checkListTemplateLine.CHK_TYPE = chkline.Type;
                    break;
                case "TOPIC":
                    checkListTemplateLine.CHK_TOPIC = chkline.Topic;
                    break;
                case "COMPARE":
                    checkListTemplateLine.CHK_COMPARE = chkline.Compare;
                    break;
            }

            repositoryCheckListTemplateLines.SaveOrUpdate(checkListTemplateLine);
            return JsonConvert.SerializeObject(new
            {
                status = 200
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var checklisttemplateline = repositoryCheckListTemplateLines.Get(id);
                if (checklisttemplateline != null)
                {
                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = checklisttemplateline
                    });
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = (string)null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiChecklistTemplateLinesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryCheckListTemplateLines.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10043", UserManager.Instance.User.Language)
            });
        }
    }
}