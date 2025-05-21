using Newtonsoft.Json;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.UI.Filters;
using Ovi.Task.UI.Helper;
using Ovi.Task.UI.Helper.Integration;
using Ovi.Task.UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Ovi.Task.UI.Api
{
    [CustomAuthorize]
    [XMLHttpRequest]
    public class ApiTaskActivitiesController : ApiController
    {
        private RepositoryTaskActivities repositoryTaskActivities;
        private RepositoryTaskActivityRevisions repositoryTaskActivityRevisions;
        private IntegrationHelper integrationHelper;
        private RepositoryTasks repositoryTasks;
        private RepositoryParameters repositoryParameters;



        private readonly int _ACTIVITYISVISIBLE = 1;

        public class UpdatePrice
        {
            public string Type { get; set; }
            public int Task { get; set; }
            public int Line { get; set; }
            public int RecordId { get; set; }
            public string Code { get; set; }
            public char AllowZero { get; set; }
            public decimal OldUnitPrice { get; set; }
            public decimal OldUnitSalePrice { get; set; }
            public decimal NewUnitPrice { get; set; }
            public decimal NewUnitSalePrice { get; set; }
        }

        public ApiTaskActivitiesController()
        {
            repositoryTaskActivities = new RepositoryTaskActivities();
            repositoryTaskActivityRevisions = new RepositoryTaskActivityRevisions();
            integrationHelper = new IntegrationHelper();
            repositoryTasks = new RepositoryTasks();
            repositoryParameters = new RepositoryParameters();
        }

        private static TMTASKACTIVITIES TaskActivityLastTouch(TMTASKACTIVITIES nTaskActivity, TMTASKACTIVITIES oTaskActivity)
        {
            var lmdepartments = new RepositoryDepartments().ListByLM(UserManager.Instance.User.Code);
            var lmdepartmentsstr = string.Empty;
            if (lmdepartments != null)
            {
                var cs_lmdepartments = string.Join(",", lmdepartments.Select(x => x.DEP_CODE));
                lmdepartmentsstr = cs_lmdepartments.Contains("*") ? "*" : cs_lmdepartments;
            }

            var isLate = oTaskActivity.TSA_SCHTO.HasValue && (nTaskActivity.TSA_SCHTO > oTaskActivity.TSA_SCHTO);
            var isLM = lmdepartmentsstr.Contains("*") ||
                       lmdepartmentsstr.Contains(nTaskActivity.TSA_DEPARTMENT);

            // "ACA" : Awaiting Completed Approval
            // "AWA" : Awaiting Approval
            // "NA"  : Not Applicable
            // "REJ" : Rejected

            var rule1 = (nTaskActivity.TSA_STATUS == "APP" && nTaskActivity.TSA_LMAPPROVALREQUIRED == '+' && isLate);
            var rule2 = (new[] { null, "AWA" }.Contains(nTaskActivity.TSA_STATUS) && nTaskActivity.TSA_LMAPPROVALREQUIRED == '+');

            if (!new[] { "NA", "REJ" }.Contains(nTaskActivity.TSA_STATUS))
            {
                nTaskActivity.TSA_STATUS = isLM
                    ? (nTaskActivity.TSA_STATUS != null ? nTaskActivity.TSA_STATUS : "APP")
                    : ((rule1 || rule2 ? "AWA" : "APP"));
            }

            if (nTaskActivity.TSA_STATUS == "REJ" && nTaskActivity.TSA_COMPLETED == '+')
            {
                nTaskActivity.TSA_STATUS = "APP";
                nTaskActivity.TSA_COMPLETED = '-';
                nTaskActivity.TSA_COMPLETEDBY = null;
                nTaskActivity.TSA_DATECOMPLETED = null;
            }

            if ((isLM || nTaskActivity.TSA_LMAPPROVALREQUIRED == '-') && nTaskActivity.TSA_STATUS == "APP" && (!(string.IsNullOrEmpty(nTaskActivity.TSA_ASSIGNEDTO) || nTaskActivity.TSA_TRADE == "*")))
            {
                throw new Exception(MessageHelper.Get("20007", UserManager.Instance.User.Language));
            }

            return nTaskActivity;
        }

        [HttpPost]
        public string List(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMTASKACTIVITIESEXTVIEW>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskActivities.ListExt(gridRequest);
                        total = RepositoryShared<TMTASKACTIVITIESEXTVIEW>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivitiesController", "List");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string ListAdvPlanningActivities(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                long total = 0;
                object data = null;

              

                switch (gridRequest.action)
                {
                    case "CNT":
                        data = RepositoryShared<TMADVPLNTASKACTIVITIES>.Count(gridRequest);
                        total = 0;
                        break;

                    default:
                        data = repositoryTaskActivities.ListAdvPlnActivities(gridRequest);
                        total = RepositoryShared<TMADVPLNTASKACTIVITIES>.Count(gridRequest);
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
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivitiesController", "ListAdvPlanningActivities");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string Save(TaskActivityModel tam)
        {
            var id = tam.TaskActivity.TSA_ID;
            var oTaskActivity = (id == 0 ? new TMTASKACTIVITIES() : repositoryTaskActivities.Get(id));

            tam.TaskActivity = TaskActivityLastTouch(tam.TaskActivity, oTaskActivity);

            if ((tam.TaskActivity.TSA_SCHFROM != null) && (tam.TaskActivity.TSA_SCHTO != null) && (!string.IsNullOrEmpty(tam.Reason)))
            {
                var nno = repositoryTaskActivityRevisions.GetNextNo(tam.TaskActivity.TSA_TASK, tam.TaskActivity.TSA_LINE);
                var r = new TMTASKACTIVITYREVISIONS
                {
                    REV_TASK = tam.TaskActivity.TSA_TASK,
                    REV_SCHFROM = tam.TaskActivity.TSA_SCHFROM.Value,
                    REV_LINE = tam.TaskActivity.TSA_LINE,
                    REV_SCHTO = tam.TaskActivity.TSA_SCHTO.Value,
                    REV_REASON = tam.Reason,
                    REV_NO = nno,
                    REV_CREATED = DateTime.Now,
                    REV_CREATEDBY = tam.TaskActivity.TSA_UPDATEDBY
                };
                repositoryTaskActivityRevisions.SaveOrUpdate(r);
            }

            repositoryTaskActivities.SaveOrUpdate(tam.TaskActivity, tam.TaskActivity.TSA_ID == 0);

            if (oTaskActivity.TSA_COMPLETED != '+' && tam.TaskActivity.TSA_COMPLETED == '+')
            {
                var nTask = repositoryTasks.Get(tam.TaskActivity.TSA_TASK);
                if (nTask.TSK_STATUS == "TAM")
                {
                    var prm = repositoryParameters.Get("ENT.TAM");
                    if (prm.PRM_VALUE == "+")
                    {
                        integrationHelper.TaskCompleted(nTask);
                    }
                }
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                taskactivity = tam.TaskActivity,
                data = MessageHelper.Get("10052", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string SavePlan(TaskActivityModel tam)
        {
            var activity = repositoryTaskActivities.Get(tam.TaskActivity.TSA_ID);
            activity.TSA_TRADE = tam.TaskActivity.TSA_TRADE;
            activity.TSA_ASSIGNEDTO = tam.TaskActivity.TSA_ASSIGNEDTO;
            activity.TSA_SCHFROM = tam.TaskActivity.TSA_SCHFROM;
            activity.TSA_SCHTO = tam.TaskActivity.TSA_SCHTO;
            activity.TSA_UPDATED = tam.TaskActivity.TSA_UPDATED;
            activity.TSA_UPDATEDBY = tam.TaskActivity.TSA_UPDATEDBY;
            activity.TSA_RECORDVERSION = tam.TaskActivity.TSA_RECORDVERSION;

            if ((tam.TaskActivity.TSA_SCHFROM != null) && (tam.TaskActivity.TSA_SCHTO != null) && (!string.IsNullOrEmpty(tam.Reason)))
            {
                var nno = repositoryTaskActivityRevisions.GetNextNo(tam.TaskActivity.TSA_TASK, tam.TaskActivity.TSA_LINE);
                var r = new TMTASKACTIVITYREVISIONS
                {
                    REV_TASK = activity.TSA_TASK,
                    REV_SCHFROM = tam.TaskActivity.TSA_SCHFROM.Value,
                    REV_SCHTO = tam.TaskActivity.TSA_SCHTO.Value,
                    REV_LINE = activity.TSA_LINE,
                    REV_REASON = tam.Reason,
                    REV_NO = nno,
                    REV_CREATED = DateTime.Now,
                    REV_CREATEDBY = activity.TSA_UPDATEDBY
                };
                repositoryTaskActivityRevisions.SaveOrUpdate(r);
            }

            repositoryTaskActivities.SaveOrUpdate(activity);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                activity = repositoryTaskActivities.GetAdvPlan(activity.TSA_ID),
                data = MessageHelper.Get("10052", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateChecklistLocked(TMTASKACTIVITIES taskActivity)
        {
            var nTaskActivity = repositoryTaskActivities.Get(taskActivity.TSA_ID);
            nTaskActivity.TSA_CHKLISTLOCKED = taskActivity.TSA_CHKLISTLOCKED;
            var activity = repositoryTaskActivities.SaveOrUpdate(nTaskActivity, nTaskActivity.TSA_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get(taskActivity.TSA_CHKLISTLOCKED == '+' ? "10038" : "10039", UserManager.Instance.User.Language),
                r = BuildActivityData(activity)
            });
        }

        [HttpPost]
        [Transaction]
        public string UpdateChecklistProgress(TMTASKACTIVITIES taskActivity)
        {
            var nTaskActivity = repositoryTaskActivities.Get(taskActivity.TSA_ID);
            nTaskActivity.TSA_CHKLISTPROGRESS = taskActivity.TSA_CHKLISTPROGRESS;
            var activity = repositoryTaskActivities.SaveOrUpdate(nTaskActivity, nTaskActivity.TSA_ID == 0);
            return JsonConvert.SerializeObject(new { status = 200, r = BuildActivityData(activity) });
        }

        [HttpPost]
        [Transaction]
        public string UpdateStatus(TMTASKACTIVITIES taskActivity)
        {
            if (taskActivity.TSA_STATUS == "APP" && string.IsNullOrEmpty(taskActivity.TSA_ASSIGNEDTO))
            {
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("20007", UserManager.Instance.User.Language) });
            }

            var nTaskActivity = repositoryTaskActivities.Get(taskActivity.TSA_ID);
            nTaskActivity.TSA_STATUS = taskActivity.TSA_STATUS;
            nTaskActivity.TSA_ASSIGNEDTO = taskActivity.TSA_ASSIGNEDTO;
            nTaskActivity.TSA_UPDATEDBY = taskActivity.TSA_UPDATEDBY;
            nTaskActivity.TSA_UPDATED = taskActivity.TSA_UPDATED;
            var activity = repositoryTaskActivities.SaveOrUpdate(nTaskActivity, nTaskActivity.TSA_ID == 0);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10052", UserManager.Instance.User.Language),
                r = BuildActivityData(activity)
            });
        }

        [HttpPost]
        public string ListRevisions(GridRequest gridRequest)
        {
            try
            {
                gridRequest = GridRequestHelper.BuildFunctionFilter(gridRequest);
                var data = repositoryTaskActivityRevisions.List(gridRequest);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetRevisionCount(TMTASKACTIVITYREVISIONS tar)
        {
            try
            {
                var data = repositoryTaskActivityRevisions.ListByTaskAndLine(tar.REV_TASK, tar.REV_LINE);
                return JsonConvert.SerializeObject(new { status = 200, data = data });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivitiesController", "GetRevisionCount");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string Get([FromBody]long id)
        {
            try
            {
                var taskActivity = repositoryTaskActivities.Get(id);

                if (taskActivity != null)
                {
                    return JsonConvert.SerializeObject(new { status = 200, data = BuildActivityData(taskActivity) });
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = (string)null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivitiesController", "Get");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        public string GetByActivity(TMTASKACTIVITIES act)
        {
            try
            {
                var taskActivity = repositoryTaskActivities.GetByTaskAndLine(act.TSA_TASK, (int)act.TSA_LINE);

                if (taskActivity != null)
                {
                    return JsonConvert.SerializeObject(new { status = 200, data = BuildActivityData(taskActivity) });
                }

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = (string)null
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivitiesController", "GetByActivity");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }

        [HttpPost]
        [Transaction]
        public string DelRec([FromBody]long id)
        {
            repositoryTaskActivities.DeleteById(id);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10053", UserManager.Instance.User.Language)
            });
        }

        private object BuildActivityData(TMTASKACTIVITIES taskActivity)
        {
            if (taskActivity.TSA_ISVISIBLE == _ACTIVITYISVISIBLE)
            {
                var drawing = new RepositoryMobileDrawings().Get(new TMMOBILEDRAWINGS
                {
                    DRW_TASK = (int)taskActivity.TSA_TASK,
                    DRW_ACTIVITY = (int)taskActivity.TSA_LINE
                });

                return new ActivityModel
                {
                    TSA_ID = taskActivity.TSA_ID,
                    TSA_TASK = taskActivity.TSA_TASK,
                    TSA_LINE = taskActivity.TSA_LINE,
                    TSA_TEMPID = taskActivity.TSA_TEMPID,
                    TSA_DESC = taskActivity.TSA_DESC,
                    TSA_DEPARTMENT = taskActivity.TSA_DEPARTMENT,
                    TSA_PREDECESSOR = taskActivity.TSA_PREDECESSOR,
                    TSA_LMAPPROVALREQUIRED = taskActivity.TSA_LMAPPROVALREQUIRED,
                    TSA_STATUS = taskActivity.TSA_STATUS,
                    TSA_COMPLETED = taskActivity.TSA_COMPLETED,
                    TSA_HIDDEN = taskActivity.TSA_HIDDEN,
                    TSA_PRIVATE = taskActivity.TSA_PRIVATE,
                    TSA_CHKLISTPROGRESS = taskActivity.TSA_CHKLISTPROGRESS,
                    TSA_CHKLISTLOCKED = taskActivity.TSA_CHKLISTLOCKED,
                    TSA_RELEASED = taskActivity.TSA_RELEASED,
                    TSA_SCHFROM = taskActivity.TSA_SCHFROM,
                    TSA_SCHTO = taskActivity.TSA_SCHTO,
                    TSA_DATECOMPLETED = taskActivity.TSA_DATECOMPLETED,
                    TSA_COMPLETEDBY = taskActivity.TSA_COMPLETEDBY,
                    TSA_CREATED = taskActivity.TSA_CREATED,
                    TSA_CREATEDBY = taskActivity.TSA_CREATEDBY,
                    TSA_UPDATED = taskActivity.TSA_UPDATED,
                    TSA_UPDATEDBY = taskActivity.TSA_UPDATEDBY,
                    TSA_RECORDVERSION = taskActivity.TSA_RECORDVERSION,
                    TSA_ISVISIBLE = taskActivity.TSA_ISVISIBLE,
                    TSA_TRADE = taskActivity.TSA_TRADE,
                    TSA_ASSIGNEDTO = taskActivity.TSA_ASSIGNEDTO,
                    TSA_PROJECTEDTIME = taskActivity.TSA_PROJECTEDTIME,
                    TSA_MOBILENOTE = taskActivity.TSA_MOBILENOTE,
                    TSA_CHK01 = taskActivity.TSA_CHK01,
                    TSA_CHK02 = taskActivity.TSA_CHK02,
                    TSA_CHK03 = taskActivity.TSA_CHK03,
                    TSA_CHK04 = taskActivity.TSA_CHK04,
                    TSA_CHK05 = taskActivity.TSA_CHK05,
                    TSA_INVOICE = taskActivity.TSA_INVOICE,
                    TSA_DEPARTMENTDESC = new RepositoryDepartments().Get(taskActivity.TSA_DEPARTMENT).DEP_DESCF,
                    TSA_ASSIGNEDTOARR = new RepositoryUsers().GetUsers(taskActivity.TSA_ASSIGNEDTO),
                    TSA_DRAWINGNOTE = drawing != null ? drawing.DRW_NOTES : null

                };
            }

            return new ActivityModel
            {
                TSA_LINE = taskActivity.TSA_LINE,
                TSA_DESC = "Description Is Not Available (Private) ",
                TSA_DEPARTMENT = taskActivity.TSA_DEPARTMENT,
                TSA_PRIVATE = taskActivity.TSA_PRIVATE,
                TSA_STATUS = taskActivity.TSA_STATUS,
                TSA_COMPLETED = taskActivity.TSA_COMPLETED,
                TSA_ISVISIBLE = taskActivity.TSA_ISVISIBLE,
                TSA_DEPARTMENTDESC = new RepositoryDepartments().Get(taskActivity.TSA_DEPARTMENT).DEP_DESCF
            };
        }

        [HttpPost]
        [Transaction]
        public string ChangeCompletedState(RepositoryTaskActivities.ActivityEndTMSModel taskActivity)
        {
            repositoryTaskActivities.ActivityEndTMS(taskActivity);

            var nTask = repositoryTasks.Get(taskActivity.AET_TASK);
            var prm = repositoryParameters.Get("ENT.TAM");
            if (prm.PRM_VALUE == "+")
            {
                if (nTask.TSK_STATUS == "TAM")
                {
                    integrationHelper.TaskCompleted(nTask);
                }
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10452", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string PutOnHold(RepositoryTaskActivities.ActivityEndTMSModel taskActivity)
        {
            repositoryTaskActivities.PutOnHold(taskActivity);
            
            var nTask = repositoryTasks.Get(taskActivity.AET_TASK);
            var prm = repositoryParameters.Get("ENT.TAM");
            if (prm.PRM_VALUE == "+")
            {
                integrationHelper.TaskHold(nTask);
            }

            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10452", UserManager.Instance.User.Language)
            });
        }

        [HttpPost]
        [Transaction]
        public string CloseActivity(TMTASKACTIVITIES taskActivity)
        {
 
            var nTaskActivity = repositoryTaskActivities.Get(taskActivity.TSA_ID);

            #region Doc. Control
            string canClose = new RepositoryDocuments().CanActivityClose("TASK", nTaskActivity.TSA_TASK.ToString());
            if (canClose != "+")
            {
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10454", UserManager.Instance.User.Language) });
            }
            #endregion
            #region BookedHours Control
            GridRequest gridRequest = new GridRequest()
            {
                action = "CNT",
                loadall = true,
                filter = new GridFilters()
                {
                    Filters = new List<GridFilter>()
                    {
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = nTaskActivity.TSA_TASK,
                            Operator = "eq",
                            Field = "BOO_TASK"
                        },
                        new GridFilter()
                        {
                            Logic = "and",
                            Value = nTaskActivity.TSA_LINE,
                            Operator = "eq",
                            Field = "BOO_LINE"
                        }
                    }
                }
            };
            var hasBookedHours = RepositoryShared<TMBOOKEDHOURS>.Count(gridRequest);
            if (hasBookedHours <= 0)
            {
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.Get("10455", UserManager.Instance.User.Language) });
            }
            #endregion

            nTaskActivity.TSA_CHK02 = '+';
            nTaskActivity.TSA_UPDATEDBY = UserManager.Instance.User.Code;
            nTaskActivity.TSA_UPDATED = DateTime.Now;

            var activity = repositoryTaskActivities.SaveOrUpdate(nTaskActivity);
            return JsonConvert.SerializeObject(new
            {
                status = 200,
                data = MessageHelper.Get("10453", UserManager.Instance.User.Language),
                r = BuildActivityData(activity)
            });


        }

        [HttpPost]
        [Transaction]
        public string SendBack(TMTASKACTIVITIES taskActivity)
        {
            try
            {
                var nTaskActivity = repositoryTaskActivities.Get(taskActivity.TSA_ID);

                nTaskActivity.TSA_CHK02 = '-';
                nTaskActivity.TSA_UPDATEDBY = UserManager.Instance.User.Code;
                nTaskActivity.TSA_UPDATED = DateTime.Now;

                var activity = repositoryTaskActivities.SaveOrUpdate(nTaskActivity);

                return JsonConvert.SerializeObject(new
                {
                    status = 200,
                    data = MessageHelper.Get("10462", UserManager.Instance.User.Language),
                    r = BuildActivityData(activity)
                });
            }
            catch (Exception e)
            {
                LogHelper.LogToDb(e, UserManager.Instance.User, "ApiTaskActivitiesController", "SendBack");
                return JsonConvert.SerializeObject(new { status = 500, data = MessageHelper.GetNonSpecificErrMsg(UserManager.Instance.User.Language) });
            }
        }


        [HttpPost]
        [Transaction]
        public string EditPrices(UpdatePrice mUpdatePrices)
        {
            RepositoryTaskActivityEquipments repositoryTaskActivityEquipments = new RepositoryTaskActivityEquipments();
            RepositoryTaskActivityServiceCodes repositoryTaskActivityServiceCodes = new RepositoryTaskActivityServiceCodes();
            RepositoryParts repositoryParts = new RepositoryParts();

            var activity = repositoryTaskActivities.GetByTaskAndLine(mUpdatePrices.Task, mUpdatePrices.Line);

            if (mUpdatePrices.Type != "PART" && mUpdatePrices.AllowZero == '-')
            {
                if (mUpdatePrices.NewUnitSalePrice != mUpdatePrices.OldUnitSalePrice)
                {
                    if (mUpdatePrices.NewUnitSalePrice <= 0)
                    {
                        return JsonConvert.SerializeObject(new
                        {
                            status = 500,
                            data = MessageHelper.Get("10646", UserManager.Instance.User.Language)
                        });
                    }
                }

            }


            switch (mUpdatePrices.Type)
            {
                case "EQUIPMENT":
                    {
                        var nTaskActivityEquipment = repositoryTaskActivityEquipments.Get(mUpdatePrices.RecordId);

                        nTaskActivityEquipment.TAE_UNITPRICE = mUpdatePrices.NewUnitPrice;
                        nTaskActivityEquipment.TAE_UNITSALESPRICE = mUpdatePrices.NewUnitSalePrice;
                        nTaskActivityEquipment.TAE_ALLOWZERO = mUpdatePrices.AllowZero;

                        repositoryTaskActivityEquipments.SaveOrUpdate(nTaskActivityEquipment, false);

                        return JsonConvert.SerializeObject(new
                        {
                            status = 200,
                            data = MessageHelper.Get("10441", UserManager.Instance.User.Language),
                            r = nTaskActivityEquipment
                        });
                    }
                case "SERVICECODE":
                    {
                        var nTaskActivityServiceCode = repositoryTaskActivityServiceCodes.Get(mUpdatePrices.RecordId);

                        nTaskActivityServiceCode.ASR_UNITPRICE = mUpdatePrices.NewUnitPrice;
                        nTaskActivityServiceCode.ASR_UNITSALESPRICE = mUpdatePrices.NewUnitSalePrice;
                        nTaskActivityServiceCode.ASR_ALLOWZERO = mUpdatePrices.AllowZero;

                        repositoryTaskActivityServiceCodes.SaveOrUpdate(nTaskActivityServiceCode, false);

                        return JsonConvert.SerializeObject(new
                        {
                            status = 200,
                            data = MessageHelper.Get("10175", UserManager.Instance.User.Language),
                            r = nTaskActivityServiceCode
                        });
                    }
                case "PART":
                    {
                        repositoryParts.UpdateTaskActivityPartPrice(activity.TSA_ID, mUpdatePrices.Code, mUpdatePrices.NewUnitSalePrice);

                        return JsonConvert.SerializeObject(new
                        {
                            status = 200,
                            data = MessageHelper.Get("10647", UserManager.Instance.User.Language),
                        });
                    }
                default:
                    return JsonConvert.SerializeObject(new
                    {
                        status = 200,
                        data = MessageHelper.Get("10463", UserManager.Instance.User.Language)
                    });
            }
        }
    }
}