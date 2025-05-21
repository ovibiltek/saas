using Newtonsoft.Json;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Ext.tr.com.shaya.boysweb;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Helper.Integration.Ziraat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using Ovi.Task.Ext;

namespace Ovi.Task.UI.Helper.Integration
{
    public class IntegrationHelper
    {
        private RepositoryCustomers repositoryCustomers;

        public IntegrationHelper()
        {
            repositoryCustomers = new RepositoryCustomers();
        }

        public void TaskCompleted(TMTASKS nTask)
        {

            var customer = repositoryCustomers.Get(nTask.TSK_CUSTOMER);
            if (nTask.TSK_CUSTOMER == "ZIRAAT.BANKASI")
            {
                var repositoryComments = new RepositoryComments();
                var repositoryLogs = new RepositoryLogs();

                var comment = repositoryComments.GetLastCommentCustomer("TASK", nTask.TSK_ID.ToString());
                var integrationHelper = new ZiraatIntegrationHelper();
                var result = integrationHelper.Resolve(new ResolveParameters
                {
                    Reference = nTask.TSK_REFERENCE,
                    ResolvedBy = UserManager.Instance.User.Description,
                    Status = 500,
                    ResolutionDetail = comment != null ? comment.CMN_TEXT : "",
                    ResolutionStartDate = OviShared.DateTime2StringWithOffset(nTask.TSK_REQUESTED.Value),
                    VendorResolutionDate = OviShared.DateTime2StringWithOffset(DateTime.Now),
                });

                repositoryLogs.SaveOrUpdate(new TMLOGS
                {
                    TML_BUNIT = "IntegrationHelper",
                    TML_BFUNC = "TaskCompleted",
                    TML_MSG = result,
                    TML_DETAILS = nTask.TSK_ID.ToString(),
                    TML_CREATED = DateTime.Now,
                    TML_CREATEDBY = UserManager.Instance.User.Code,
                    TML_RECORDVERSION = 0
                });

            }
        }

        public void TaskClosed(TMTASKS nTask)
        {
            var customer = repositoryCustomers.Get(nTask.TSK_CUSTOMER);
            if (customer.CUS_GROUP == "SHAYA")
            {
                if (!string.IsNullOrEmpty(nTask.TSK_REFERENCE) && nTask.TSK_REFERENCE.Contains("-"))
                {
                    var shaya_CompanyID = WebConfigurationManager.AppSettings["shaya_CompanyID"];
                    var shaya_InstanceName = WebConfigurationManager.AppSettings["shaya_InstanceName"];
                    var shaya_UserCode = WebConfigurationManager.AppSettings["shaya_UserCode"];
                    var shaya_Password = WebConfigurationManager.AppSettings["shaya_Password"];

                    var loginParams = new Login
                    {
                        CompanyID = shaya_CompanyID,
                        InstanceName = shaya_InstanceName,
                        UserCode = shaya_UserCode,
                        Password = shaya_Password
                    };

                    var integrationHelper = new ShayaIntegrationHelper(loginParams, UserManager.Instance.User);
                    var extTask = integrationHelper.GetExtTask(nTask.TSK_ID);
                    integrationHelper.CloseWorkOrder(extTask);

                }
            }
        }

        public void TaskHold(TMTASKS nTask)
        {
            var customer = repositoryCustomers.Get(nTask.TSK_CUSTOMER);
            if (nTask.TSK_CUSTOMER == "ZIRAAT.BANKASI")
            {
                var repositoryComments = new RepositoryComments();
                var repositoryLogs = new RepositoryLogs();
                var repositoryHoldReasons = new RepositoryHoldReasons();

                var holdreason = repositoryHoldReasons.Get(nTask.TSK_HOLDREASON);
                var integrationHelper = new ZiraatIntegrationHelper();
                var result = integrationHelper.SendForApproval(new SendForApprovalParameters
                {
                    Reference = nTask.TSK_REFERENCE,
                    ApprovalCode = 110,
                    ApprovalReason = holdreason.HDR_DESC,
                    SuspendDate = OviShared.DateTime2StringWithOffset(DateTime.Now.AddDays(1)),
                });

                repositoryComments.SaveOrUpdate(new TMCOMMENTS
                {
                    CMN_SUBJECT = "TASK",
                    CMN_SOURCE = nTask.TSK_ID.ToString(),
                    CMN_ORGANIZATION = nTask.TSK_ORGANIZATION,
                    CMN_VISIBLETOCUSTOMER = '-',
                    CMN_VISIBLETOSUPPLIER = '-',
                    CMN_CREATED = DateTime.Now,
                    CMN_CREATEDBY = UserManager.Instance.User.Code,
                    CMN_RECORDVERSION = 0,
                    CMN_UPDATED = null,
                    CMN_UPDATEDBY = null,
                    CMN_TEXT = "Beklemede için onay istendi."
                });

                repositoryLogs.SaveOrUpdate(new TMLOGS
                {
                    TML_BUNIT = "IntegrationHelper",
                    TML_BFUNC = "TaskHold",
                    TML_MSG = result,
                    TML_DETAILS = nTask.TSK_ID.ToString(),
                    TML_CREATED = DateTime.Now,
                    TML_CREATEDBY = UserManager.Instance.User.Code,
                    TML_RECORDVERSION = 0
                });
            }
        }

        public void TaskCancel(TMTASKS nTask)
        {
            var customer = repositoryCustomers.Get(nTask.TSK_CUSTOMER);
            if (nTask.TSK_CUSTOMER == "ZIRAAT.BANKASI")
            {
                var repositoryComments = new RepositoryComments();
                var repositoryLogs = new RepositoryLogs();
                var repositoryCancellationReasons = new RepositoryCancellationReasons();
                var cancellationreason = repositoryCancellationReasons.Get(new TMCANCELLATIONREASONS
                {
                    CNR_ENTITY = "TASK",
                    CNR_CODE = nTask.TSK_CANCELLATIONREASON
                });

                var integrationHelper = new ZiraatIntegrationHelper();
                var result = integrationHelper.SendForApproval(new SendForApprovalParameters
                {
                    Reference = nTask.TSK_REFERENCE,
                    ApprovalCode = 120,
                    ApprovalReason = cancellationreason.CNR_DESC
                });

                repositoryComments.SaveOrUpdate(new TMCOMMENTS
                {
                    CMN_SUBJECT = "TASK",
                    CMN_SOURCE = nTask.TSK_ID.ToString(),
                    CMN_ORGANIZATION = nTask.TSK_ORGANIZATION,
                    CMN_VISIBLETOCUSTOMER = '-',
                    CMN_VISIBLETOSUPPLIER = '-',
                    CMN_CREATED = DateTime.Now,
                    CMN_CREATEDBY = UserManager.Instance.User.Code,
                    CMN_RECORDVERSION = 0,
                    CMN_UPDATED = null,
                    CMN_UPDATEDBY = null,
                    CMN_TEXT = "İptal için onay istendi."
                });

                repositoryLogs.SaveOrUpdate(new TMLOGS
                {
                    TML_BUNIT = "IntegrationHelper",
                    TML_BFUNC = "TaskCancel",
                    TML_MSG = result,
                    TML_DETAILS = nTask.TSK_ID.ToString(),
                    TML_CREATED = DateTime.Now,
                    TML_CREATEDBY = UserManager.Instance.User.Code,
                    TML_RECORDVERSION = 0
                });
            }
        }
    }
}