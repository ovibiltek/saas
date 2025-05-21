using Newtonsoft.Json;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Ovi.Task.UI.Filters
{
    [AttributeUsage(AttributeTargets.Method)]
    public class TransactionAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var confirmation = actionContext.Request.GetHeader("confirmation");
            if (confirmation == "+")
            {
                var confirmationResult = CheckConfirmationHelper.CheckConfirmation(actionContext);
                if (confirmationResult.Count > 0)
                {
                    SetJsonResult_2(actionContext, confirmationResult);
                }
               
            }
            NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
        }

        public override void OnActionExecuted(HttpActionExecutedContext filterContext)
        {
            try
            {
                if (filterContext.Exception == null)
                {
                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                else
                {
                    try
                    {
                        NHibernateSessionManager.Instance.RollbackTransaction();
                    }
                    catch { }
                    throw filterContext.Exception;
                }
            }
            catch (ForeignKeyException e)
            {
                NHibernateSessionManager.Instance.CloseSession();
                LogHelper.LogToDb(e, UserManager.Instance.User, filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName, filterContext.ActionContext.ActionDescriptor.ActionName);
                SetJsonResult(filterContext, MessageHelper.Get("20001", UserManager.Instance.User.Language));
            }
            catch (ValueNotFoundException e)
            {
                NHibernateSessionManager.Instance.CloseSession();
                LogHelper.LogToDb(e, UserManager.Instance.User, filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName, filterContext.ActionContext.ActionDescriptor.ActionName);
                SetJsonResult(filterContext, MessageHelper.Get("20008", UserManager.Instance.User.Language));
            }
            catch (UniqueConstraintException e)
            {
                NHibernateSessionManager.Instance.CloseSession();
                LogHelper.LogToDb(e, UserManager.Instance.User, filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName, filterContext.ActionContext.ActionDescriptor.ActionName);
                SetJsonResult(filterContext, MessageHelper.Get("20014", UserManager.Instance.User.Language));
            }
            catch (PrimaryKeyException e)
            {
                NHibernateSessionManager.Instance.CloseSession();
                LogHelper.LogToDb(e, UserManager.Instance.User, filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName, filterContext.ActionContext.ActionDescriptor.ActionName);
                SetJsonResult(filterContext, MessageHelper.Get("20014", UserManager.Instance.User.Language));
            }
            catch (TmsException te)
            {
                NHibernateSessionManager.Instance.CloseSession();
                LogHelper.LogToDb(te, UserManager.Instance.User, filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName, filterContext.ActionContext.ActionDescriptor.ActionName);
                SetJsonResult(filterContext, te.Message);
            }
            catch (Exception e)
            {
                NHibernateSessionManager.Instance.CloseSession();
                LogHelper.LogToDb(e, UserManager.Instance.User, filterContext.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName, filterContext.ActionContext.ActionDescriptor.ActionName);
                SetJsonResult(filterContext, MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language));
            }
        }

        private static void SetJsonResult(HttpActionExecutedContext filterContext, string msg)
        {
            var request = filterContext.Request;
            var response = filterContext.Response;
            var rw = ((string[])request.Headers.GetValues("X-Requested-With"))[0];
            switch (rw)
            {
                case "XMLHttpRequest":
                    if (response == null)
                    {
                        filterContext.Response = new HttpResponseMessage { Content = new ObjectContent<string>(JsonConvert.SerializeObject(new { status = 500, data = msg }), new JsonMediaTypeFormatter()) };
                    }
                    else
                    {
                        var objectContent = response.Content as ObjectContent;
                        if (objectContent != null)
                            objectContent.Value = JsonConvert.SerializeObject(new { status = 500, data = msg });
                    }

                    break;
            }
        }

        private static void SetJsonResult_2(HttpActionContext filterContext, IList<RepositoryConfirmations.ConfirmationResult> msg)
        {
            var request = filterContext.Request;
            var response = filterContext.Response;
            var rw = ((string[])request.Headers.GetValues("X-Requested-With"))[0];
            switch (rw)
            {
                case "XMLHttpRequest":
                    if (response == null)
                    {
                        filterContext.Response = new HttpResponseMessage { Content = new ObjectContent<string>(JsonConvert.SerializeObject(new { status = 100, data = msg }), new JsonMediaTypeFormatter()) };
                    }
                    else
                    {
                        var objectContent = response.Content as ObjectContent;
                        if (objectContent != null)
                            objectContent.Value = JsonConvert.SerializeObject(new { status = 100, data = msg });
                    }

                    break;
            }
        }
    }
}