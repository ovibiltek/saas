using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions.Types;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.UI.Helper.Integration.Ziraat;
using Ovi.Task.Helper.Shared;
using Ovi.Task.UI.Helper.Integration;
using NPOI.SS.Formula.Functions;
using Ovi.Task.UI.Models;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTaskController : ApiController
    {
        private RepositoryTasks repositoryTasks;
        private RepositoryCustomFieldValues repositoryCustomFieldValues;
        private IntegrationHelper integrationHelper;
        private RepositoryParameters repositoryParameters;


        public ApiTaskController()
        {
            repositoryTasks = new RepositoryTasks();
            repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            integrationHelper = new IntegrationHelper();
            repositoryParameters = new RepositoryParameters();
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {

                gridRequest =GridRequestHelper.BuildFunctionFilter(GridRequestHelper.BuildCustomFieldFilter(GridRequestHelper.FilterMoreSpecificV1(gridRequest, "TSK_CUSTOMER", "TSK_ORGANIZATION", "TSK_DEPARTMENT"), "TSK_ID"));
                object data = null;
                IList<TMCUSTOMFIELDVALUES> customFieldValues = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKLISTVIEW>.Count(gridRequest);
                        break;
                    default:
                        var lst = repositoryTasks.ListView(gridRequest);
                        data = lst;
                        customFieldValues = repositoryCustomFieldValues.GetBySubjectAndSource("TASK", lst.Select(x => x.TSK_ID.ToString()).ToArray());
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data,
                    customfieldvalues = customFieldValues
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListProgressPaymentView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV1(gridRequest, "TSK_CUSTOMER", "TSK_ORGANIZATION", null);
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMPROGRESSPAYMENTTASKLISTVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListProgressPaymentView(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListProgressPaymentView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListTaskSummaryForCustomer(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKSUMMARYFORCUSTOMERVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListTaskSummaryForCustomer(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListTaskSummaryForCustomer");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListActivities(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV1(gridRequest, "TSK_CUSTOMER", "TSK_ORGANIZATION", "TSK_DEPARTMENT");
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKACTIVITIESVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListActivities(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListActivities");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListPlanPreview(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKPLANPREVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListPlanPreview(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListPlanPreview");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListRatingView(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTSKRATINGVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListRatingView(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListRatingView");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListPerformance(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKDETAILSVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListPerformance(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListPerformance");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListAmounts(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV1(gridRequest, "ANT_TASKCUSTOMER", "ANT_TASKORGANIZATION","ANT_TASKDEPARTMENT");
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKAMOUNTSVIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListAmounts(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListAmounts");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListAmountsM1(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                gridRequest = GridRequestHelper.FilterMoreSpecificV1(gridRequest, "ANT_TASKCUSTOMER", "ANT_TASKORGANIZATION","ANT_TASKDEPARTMENT");
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKAMOUNTSM1VIEW>.Count(gridRequest);
                        break;

                    default:
                        data = repositoryTasks.ListAmountsM1(gridRequest);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "ListAmountsM1");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }
        [HttpPost]
        [Transaction]
        public string Save(TaskModel mtask)
        {
            var task2Save = mtask.Task;

            var actionType = "NONE";
            var oTask = (task2Save.TSK_ID == 0 ? new TMTASKS() : repositoryTasks.Get(task2Save.TSK_ID));

            if (task2Save.TSK_ID == 0)
            {
                actionType = "NEWTASK";
                task2Save.TSK_CREATED = DateTime.Now;
                task2Save.TSK_CREATEDBY = UserManager.Instance.User.Code;
            }
            else
            {
                task2Save.TSK_CREATED = oTask.TSK_CREATED;
                task2Save.TSK_CREATEDBY = oTask.TSK_CREATEDBY;
                task2Save.TSK_UPDATED = DateTime.Now;
                task2Save.TSK_UPDATEDBY = UserManager.Instance.User.Code;
                if (task2Save.TSK_STATUS != oTask.TSK_STATUS)
                {
                    actionType = "STATUSCHNG";
                }
            }

            // Durum değişikliği sırasında
            // EKMAL özel alanının değeri silinecek
            if (oTask.TSK_ID != 0 && oTask.TSK_STATUS != task2Save.TSK_STATUS)
            {
                var ekmal = mtask.CustomFieldValues.SingleOrDefault(x => x.CFV_CODE == "EKMAL");
                if (ekmal != null)
                    ekmal.CFV_TEXT = "";
            }

            if (oTask.TSK_ID != 0 && oTask.TSK_STATUS == task2Save.TSK_STATUS)
            {
                var repositoryUsers = new RepositoryUsers();
                var repositoryStatusAuth = new RepositoryStatusAuth();

                var usr = repositoryUsers.Get(task2Save.TSK_UPDATEDBY);
                var lst = repositoryStatusAuth.RetrieveByAuth(new RetrieveByAuthParams
                {
                    Entity = "TASK",
                    CreatedBy = task2Save.TSK_CREATEDBY,
                    Fromcode = task2Save.TSK_STATUS,
                    MDepartment = usr.USR_DEPARTMENT,
                    RequestedBy = task2Save.TSK_REQUESTEDBY,
                    SystemUser = usr.USR_CODE,
                    TDepartment = task2Save.TSK_DEPARTMENT,
                    Typ = task2Save.TSK_TYPE,
                    Usergroup = usr.USR_GROUP
                });

                if (lst.Count == 0)
                {
                    return JsonConvert.SerializeObject(new { status = 500, focuselements = "#status", data = MessageHelper.Get("20009", UserManager.Instance.User.Language) });
                }
            }

            if (task2Save.TSK_STATUS == "IPT")
            {
                var oTaskClone = (TMTASKS)oTask.Clone();
                oTaskClone.TSK_STATUS = "IPT";
                oTaskClone.TSK_CANCELLATIONREASON = task2Save.TSK_CANCELLATIONREASON;
                oTaskClone.TSK_CANCELLATIONDESC = task2Save.TSK_CANCELLATIONDESC;
                oTaskClone.TSK_UPDATED = DateTime.Now;
                oTaskClone.TSK_UPDATEDBY = UserManager.Instance.User.Code;
                task2Save = oTaskClone;   
            }

            // Type is changing
            if (task2Save.TSK_TYPE != oTask.TSK_TYPE)
            {
                var repositoryTaskActivities = new RepositoryTaskActivities();
                repositoryTaskActivities.DeleteByTask(task2Save.TSK_ID);
            }

            var nTask = repositoryTasks.SaveOrUpdate(task2Save);
            mtask.Task.TSK_ID = nTask.TSK_ID;
            SaveNotification(actionType, nTask);

            if (task2Save.TSK_STATUS != "IPT")
            {
                SaveCustomFieldValues(mtask);
            }

            if (oTask.TSK_STATUS != "TAM" && nTask.TSK_STATUS == "TAM")
            {
                var prm = repositoryParameters.Get("ENT.TAM");
                if (prm!=null && prm.PRM_VALUE == "+")
                {
                    integrationHelper.TaskCompleted(nTask);
                }
            }

            if (oTask.TSK_STATUS != "K" && nTask.TSK_STATUS == "K")
            {
                var prm = repositoryParameters.Get("ENT.K");
                if (prm != null && prm.PRM_VALUE == "+")
                {
                    //integrationHelper.TaskClosed(nTask);
                }
            }

            if (oTask.TSK_STATUS != "IPT" && nTask.TSK_STATUS == "IPT")
            {
                var prm = repositoryParameters.Get("ENT.IPT");
                if (prm != null && prm.PRM_VALUE == "+")
                {
                    integrationHelper.TaskCancel(nTask);
                }
            }


            if (oTask.TSK_STATUS != "BEK" && nTask.TSK_STATUS == "BEK")
            {
                var prm = repositoryParameters.Get("ENT.BEK");
                if (prm != null && prm.PRM_VALUE == "+")
                {
                    integrationHelper.TaskHold(nTask);
                }
            }


            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10001", UserManager.Instance.User.Language), id = nTask.TSK_ID });
        }

        [HttpPost]
        [Transaction]
        public string SaveRating(TMTASKS task)
        {

            var taskOnDb = repositoryTasks.Get(task.TSK_ID);
            if (taskOnDb.TSK_RATING.HasValue)
                throw new TmsException(MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language));

            repositoryTasks.SaveOrUpdate(task, task.TSK_ID == 0);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10429", UserManager.Instance.User.Language)});

        }

        [HttpPost]
        [Transaction]
        public string SaveReview(ReviewModel model)
        {
            
            var review = repositoryTasks.GetReview(model.Review.TRR_TSKID);
            if (review == null)
            {
                repositoryTasks.SaveReview(model.Review);
                if(model.Review.TRR_SENDMAIL == "+")
                {
                    var repositoryUsers = new RepositoryUsers();
                    string to = "";
                    if(model.RatedBy != null && model.RatedBy != "")
                    {
                       
                        var user = repositoryUsers.Get(model.RatedBy);
                        to = String.IsNullOrEmpty(user.USR_EMAIL) ? user.USR_ALTERNATEEMAIL : user.USR_EMAIL;
                        
                    }
                    if(to == "")
                    {
                        var repositoryBranches = new RepositoryBranches();
                        var branch = repositoryBranches.Get(model.Branch);
                        to = branch.BRN_CSR;
                    }
                    if(to.Trim() != "")
                    {
                        string cc = repositoryUsers.Get(model.Review.TRR_CREATEDBY).USR_DESC;

                        QuickMailHelper quickMailHelper = new QuickMailHelper();
                        string body = "Sayın Yetikili, <br> <br> " + model.Review.TRR_TSKID + " no'lu göreve yaptığınız değerlendirme için teşekkürler.Geri Bilgidirimimiz aşağıdaki şekildedir: <br> " 
                            + model.Review.TRR_REVIEW + " <br> İyi Çalışmalar.";
                        quickMailHelper.SingleMail(null, to, "Göreve yaptığınız değerlendirme hakkında bilgilendirme", cc, "X", body);
                    }
                   

                }
               
            }
            else
            {
                throw new TmsException(MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language));
            }
            return JsonConvert.SerializeObject(new { status = 200, data = "Başarıyla Kaydedildi" });

        }

        [HttpPost]
        [Transaction]
        public string GeneratePricing(TMTASKS task)
        {
            repositoryTasks.GeneratePricing(task.TSK_ID);
            return JsonConvert.SerializeObject(new { status = 200 });
        }

        [HttpPost]
        [Transaction]
        public string UpdateEquipment(TMTASKS task)
        {
            repositoryTasks.UpdateEquipment(task.TSK_ID,(long) task.TSK_EQUIPMENT);
            return JsonConvert.SerializeObject(new { status = 200, data = MessageHelper.Get("10001", UserManager.Instance.User.Language) });
        }

        private static void SaveCustomFieldValues(TaskModel mtask)
        {
            // Save Custom Field Values
            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
            repositoryCustomFieldValues.Save("TASK", mtask.Task.TSK_ID.ToString(), mtask.CustomFieldValues);
        }

        private static void SaveNotification(string actionType, TMTASKS nTask)
        {
            switch (actionType)
            {
                case "NEWTASK":
                    var repositoryNotifications = new RepositoryNotifications();
                    repositoryNotifications.SaveOrUpdate(new TMNOTIFICATIONS
                    {
                        NOT_TYPE = "NEWTASK",
                        NOT_CREATED = DateTime.Now,
                        NOT_CREATEDBY = UserManager.Instance.User.Code,
                        NOT_SUBJECT = "TASK",
                        NOT_DESC = string.Format("{0} - {1}", nTask.TSK_ID, nTask.TSK_SHORTDESC),
                        NOT_READ = '-',
                        NOT_SOURCE = nTask.TSK_ID.ToString()
                    });
                    break;
            }
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var task = GetTask(id);
                var taskStatus =
                    new RepositoryStatuses().Get(new TMSTATUSES { STA_ENTITY = "TASK", STA_CODE = task.TSK_STATUS });
                var followusers = new RepositoryUsers().GetUsers(task.TSK_FOLLOWED);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = task,
                    exdata = new object[] { taskStatus, followusers }
                });
            }
            catch (TmsException te)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = te.Message });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        private static TMTASKLISTVIEW GetTask(long id)
        {
            var gridRequest = new GridRequest();
            var filter = new GridFilters { Filters = new List<GridFilter>() };
            var authorizedDepartments = UserManager.Instance.User.AuthorizedDepartments.Split(',');
            if (!authorizedDepartments.Contains("*"))
            {
                var authorizedDepartmentsJArray = new JArray(authorizedDepartments);
                filter.Filters.Add(new GridFilter { Field = "TSK_DEPARTMENT", Value = authorizedDepartmentsJArray, Operator = "in", Logic = "or" });
                filter.Filters.Add(new GridFilter { Field = "TSK_CREATEDBYDEPARTMENT", Value = authorizedDepartmentsJArray, Operator = "in", Logic = "or" });
                filter.Filters.Add(new GridFilter { Field = "TSK_CREATEDBY", Value = UserManager.Instance.User.Code, Operator = "eq", Logic = "or" });
                filter.Filters.Add(new GridFilter { Field = "TSK_REQUESTEDBY", Value = UserManager.Instance.User.Code, Operator = "eq", Logic = "or" });
                filter.Filters.Add(new GridFilter { Value = string.Format("EXISTS (SELECT 1 FROM dbo.GetActivityDepartmentAuthTable('{0}') auth WHERE auth.TSK_ID = TSK_ID)", UserManager.Instance.User.Code), Operator = "sqlfunc", Logic = "or" });
            }

            filter.Filters.Add(new GridFilter { Field = "TSK_ID", Value = id, Operator = "eq", Logic = "and" });
            gridRequest.filter = filter;
            gridRequest = GridRequestHelper.FilterMoreSpecificV1(gridRequest, "TSK_CUSTOMER", "TSK_ORGANIZATION","TSK_DEPARTMENT");

            var repositoryTasks = new RepositoryTasks();
            var tasklist = repositoryTasks.ListView(gridRequest);
            if (tasklist.Count == 0)
            {
                throw new TmsException(MessageHelper.Get("10401", UserManager.Instance.User.Language));
            }

            return tasklist.FirstOrDefault();
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            if (id != 0)
            {
                repositoryTasks.DeleteById(id);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10002", UserManager.Instance.User.Language),
            });
        }

        [HttpPost]
        [Transaction]
        public string GetTabCounts([FromBody]long id)
        {
            try
            {
                var cntlst = repositoryTasks.GetTabCounts(id);
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = cntlst
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "GetTabCounts");
                return JsonConvert.SerializeObject(new
                {
                    status = 500,
                    data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language)
                });
            }
        }

        [HttpPost]
        public string GetTaskContactInfo([FromBody] int task)
        {
            try 
            {
                var contactInfo = repositoryTasks.GetTaskContactInfo(task);
                if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier) || !string.IsNullOrEmpty(UserManager.Instance.User.Customer))
                    contactInfo = contactInfo.Where(x => x.CON_TYPE != "SUP").ToList();
                
                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = contactInfo
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "GetTaskContactInfo");
                return JsonConvert.SerializeObject(new
                {
                    status = 500,
                    data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language)
                });
            }
        }

        [HttpPost]
        public string TaskPricing(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKPRICING>.Count(gridRequest);
                        break;

                    default:

                        data = repositoryTasks.ListTaskPricing(gridRequest);
                        if (!string.IsNullOrEmpty(UserManager.Instance.User.Supplier))
                            data = HideFieldValuesFromSupplier((IList<TMTASKPRICING>)data);
                        break;
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = data
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskController", "TaskPricing");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        private IList<TMTASKPRICING> HideFieldValuesFromSupplier(IList<TMTASKPRICING> data)
        {
            foreach (var d in data)
            {
                d.TPR_UNITSALESPRICE = 0;
                d.TPR_TOTALSALESPRICE = 0;
            }
            return data;
        }

        [HttpPost]
        [Transaction]
        public string ChangeStatuses(BulkTaskModel taskModel)
        {
            var tasks = new List<TMTASKS>();
            foreach (var tskid in taskModel.Lines)
            {
                var tsk = repositoryTasks.Get(tskid);
                tsk.TSK_UPDATED = DateTime.Now;
                tsk.TSK_UPDATEDBY = UserManager.Instance.User.Code;
                tsk.TSK_STATUS = taskModel.Status;
                tasks.Add(tsk);
            }

            repositoryTasks.SaveList(tasks.ToArray());

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("ATS10001", UserManager.Instance.User.Language),
            });
        }
    }
}