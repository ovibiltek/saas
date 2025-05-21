using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiCommentsController : ApiController
    {
        private RepositoryComments repositoryComments;

        public ApiCommentsController()
        {
            repositoryComments = new RepositoryComments();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                if (!string.IsNullOrEmpty(UserManager.Instance.User.Customer))
                {
                    gridRequest.filter.Filters.Add(new GridFilter { Field = "CMN_VISIBLETOCUSTOMER", Value = "+", Operator = "eq" });
                }

                object data;
                long total;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMCOMMENTSVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryComments.ListView(gridRequest);
                        total = RepositoryShared<TMCOMMENTSVIEW>.Count(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    total = total
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCommentsController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string Save(TMCOMMENTS pcDComments)
        {
            if (pcDComments.CMN_ID == 0)
            {
                pcDComments.CMN_CREATED = DateTime.Now;
                pcDComments.CMN_ORGANIZATION = UserManager.Instance.User.Org;
                pcDComments.CMN_CREATEDBY = UserManager.Instance.User.Code;
            }

            var strcmnt = HtmlToText.ConvertHtml(pcDComments.CMN_TEXT);
            var plainText = strcmnt.Length > 40 ? strcmnt.Substring(0, 40) : strcmnt;

            var repositoryNotifications = new RepositoryNotifications();
            repositoryNotifications.SaveOrUpdate(new TMNOTIFICATIONS
            {
                NOT_TYPE = "NEWCOMMENT",
                NOT_CREATED = DateTime.Now,
                NOT_CREATEDBY = UserManager.Instance.User.Code,
                NOT_SUBJECT = pcDComments.CMN_SUBJECT,
                NOT_DESC = string.Format("{0}...", plainText),
                NOT_READ = '-',
                NOT_SOURCE = pcDComments.CMN_SOURCE
            });

            var o = repositoryComments.SaveOrUpdate(pcDComments);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10071", UserManager.Instance.User.Language),
                source = o.CMN_SOURCE,
                subject = o.CMN_SUBJECT
            });
        }

        [HttpPost]
        [Transaction]
        public string Update(TMCOMMENTS cmnt)
        {
            var cmno = repositoryComments.Get(cmnt.CMN_ID);

            cmno.CMN_TEXT = cmnt.CMN_TEXT;
            cmno.CMN_UPDATED = cmnt.CMN_UPDATED;
            cmno.CMN_UPDATEDBY = cmnt.CMN_UPDATEDBY;

            var strcmnt = HtmlToText.ConvertHtml(cmnt.CMN_TEXT);
            var plainText = strcmnt.Length > 40 ? strcmnt.Substring(0, 40) : strcmnt;

            var repositoryNotifications = new RepositoryNotifications();
            repositoryNotifications.SaveOrUpdate(new TMNOTIFICATIONS
            {
                NOT_TYPE = "NEWCOMMENT",
                NOT_CREATED = cmno.CMN_UPDATED.HasValue ? cmno.CMN_UPDATED.Value : DateTime.Now,
                NOT_CREATEDBY = cmno.CMN_UPDATEDBY,
                NOT_SUBJECT = cmno.CMN_SUBJECT,
                NOT_DESC = string.Format("{0}...", plainText),
                NOT_READ = '-',
                NOT_SOURCE = cmno.CMN_SOURCE
            });

            var o = repositoryComments.SaveOrUpdate(cmno);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10071", UserManager.Instance.User.Language),
                source = o.CMN_SOURCE,
                subject = o.CMN_SUBJECT
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateSeen(TMCOMMENTS cmnt)
        {
            var cmno = repositoryComments.Get(cmnt.CMN_ID);
            cmno.CMN_DATESEEN = cmnt.CMN_DATESEEN;
            cmno.CMN_SEENBY = cmnt.CMN_SEENBY;

            var o = repositoryComments.SaveOrUpdate(cmno);
            var d = repositoryComments.GetViewById(o.CMN_ID);

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = d
            });
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var cmnt = repositoryComments.Get(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cmnt
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiCommentsController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryComments.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("20015", UserManager.Instance.User.Language)
            });
        }
    }
}