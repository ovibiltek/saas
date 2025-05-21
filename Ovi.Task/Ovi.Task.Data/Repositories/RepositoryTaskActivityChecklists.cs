using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using System;
using System.Collections.Generic;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System.Data;

namespace Ovi.Task.Data.Repositories
{
    public class CreateChecklistParams
    {
        public CreateChecklistParams(int tacId, string template, int task, int activity)
        {
            TacId = tacId;
            Template = template;
            Task = task;
            Activity = activity;
        }

        public int TacId { get; private set; }
        public string Template { get; private set; }
        public int Task { get; private set; }
        public int Activity { get; private set; }
    }

    public class RepositoryTaskActivityChecklists : BaseRepository<TMTASKACTIVITYCHECKLISTS, int>
    {
        public void CreateChecklist(CreateChecklistParams createChecklistParams)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_CREATE_CHECKLIST @pTacId=:tacid, " +
                                                      "@pTemplate=:template, " +
                                                      "@pTask=:task,  " +
                                                      "@pActivity=:activity ");
                query.SetInt32("tacid", createChecklistParams.TacId);
                query.SetString("template", createChecklistParams.Template);
                query.SetInt32("task", createChecklistParams.Task);
                query.SetInt32("activity", createChecklistParams.Activity);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<ErrLine> Save(List<TaskActivityChecklistParameterModel> lstOfTaskActivityChecklist, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (var i = 0; i < lstOfTaskActivityChecklist.Count; i++)
            {
                var taskactivitychecklist = lstOfTaskActivityChecklist[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(taskactivitychecklist.TaskActivityChecklist);
                    CreateChecklist(new CreateChecklistParams(taskactivitychecklist.TaskActivityChecklist.TAC_ID,
                                                                taskactivitychecklist.TaskActivityChecklist.TAC_CHKTMP,
                                                                taskactivitychecklist.TaskActivityChecklist.TAC_TASK,
                                                                taskactivitychecklist.TaskActivityChecklist.TAC_ACTIVITY));

                    NHibernateSessionManager.Instance.CommitTransaction();

                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = taskactivitychecklist.Values,
                        ErrMsg = ExceptionHandler.Process(exc).Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstOfTaskActivityChecklist.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }
    }
}