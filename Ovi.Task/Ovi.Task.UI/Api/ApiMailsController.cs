using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    public class QuickMailParameters
    {
        public string Subject { get; set; }

        public string Content { get; set; }

        public string To { get; set; }

        public string Cc { get; set; }

        public string Format { get; set; }

        public string SingleMail { get; set; }
    }

    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiMailsController : ApiController
    {
        private RepositoryMails repositoryMails;

        public ApiMailsController()
        {
            repositoryMails = new RepositoryMails();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMMAILS>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryMails.List(gridRequest);
                        total = RepositoryShared<TMMAILS>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new { status = 200, data = data, total = total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMailsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListSysEMails(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data;
                long total = 0;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMEMAILVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryMails.ListSysEMails(gridRequest);
                        total = RepositoryShared<TMEMAILVIEW>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new { status = 200, data = data, total = total });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiMailsController", "ListSysEMails");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Build([FromBody] long maid)
        {
            try
            {
                var mailevent = repositoryMails.Get(maid);

                var repositoryMailParameters = new RepositoryMailParameters();
                var parameters = repositoryMailParameters.ListByMail(maid);

                var repositoryMailTemplates = new RepositoryMailTemplates();
                var template = repositoryMailTemplates.GetByTemplateId(mailevent.MA_TEMPLATEID);
                if (template == null)
                {
                    throw new Exception("Template is not defined");
                }

                var tmpBuild = MailBuilder.Build(mailevent, parameters, template);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = tmpBuild
                });
            }
            catch (Exception exc)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = exc.Message });
            }
        }

        [HttpPost]
        [Transaction]
        public string QuickMail(QuickMailParameters quickMailParameters)
        {
            var quickMailHelper = new QuickMailHelper();
            quickMailParameters.Content = HttpUtility.HtmlDecode(quickMailParameters.Content);
            if (quickMailParameters.SingleMail == "+")
            {
                quickMailHelper.SingleMail(null, quickMailParameters.To, quickMailParameters.Subject, quickMailParameters.Cc, quickMailParameters.Format, quickMailParameters.Content);
            }
            else
            {
                quickMailHelper.MultipleMail(null, quickMailParameters.To, quickMailParameters.Subject, quickMailParameters.Cc, quickMailParameters.Format, quickMailParameters.Content);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10412", UserManager.Instance.User.Language)
            });
        }
    }
}