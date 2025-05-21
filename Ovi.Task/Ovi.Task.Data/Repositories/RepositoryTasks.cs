using NHibernate;
using NHibernate.Linq;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTasks : BaseRepository<TMTASKS, long>
    {
        public IList<TMTASKLISTVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKLISTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTSKRATINGVIEW> ListRatingView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTSKRATINGVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKSUMMARYFORCUSTOMERVIEW> ListTaskSummaryForCustomer(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKSUMMARYFORCUSTOMERVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMPROGRESSPAYMENTTASKLISTVIEW> ListProgressPaymentView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMPROGRESSPAYMENTTASKLISTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKACTIVITIESVIEW> ListActivities(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKACTIVITIESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKPLANPREVIEW> ListPlanPreview(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKPLANPREVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKSTATUSDURATIONS> TaskStatusDurations(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKSTATUSDURATIONS>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKDETAILSVIEW> ListPerformance(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKDETAILSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKAMOUNTSVIEW> ListAmounts(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKAMOUNTSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKAMOUNTSM1VIEW> ListAmountsM1(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKAMOUNTSM1VIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<ErrLine> Save(List<TaskModel> lstoftasks, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstoftasks.Count; i++)
            {
                TaskModel tsk = lstoftasks[i];
                try
                {
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    SaveOrUpdate(tsk.Task);
                    if (tsk.Comments != null)
                    {
                        var repositoryComments = new RepositoryComments();
                        foreach (var cmnt in tsk.Comments)
                        {
                            cmnt.CMN_SOURCE = tsk.Task.TSK_ID.ToString();
                            repositoryComments.SaveOrUpdate(cmnt, true);
                        }
                    }

                    if (tsk.CustomFieldValues != null)
                    {
                        var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
                        repositoryCustomFieldValues.Save("TASK", tsk.Task.TSK_ID.ToString(), tsk.CustomFieldValues);
                    }

                    if (!string.IsNullOrEmpty(tsk.Trade) || tsk.ActivePlanningDate.HasValue)
                    {
                        var repositoryTaskActivities = new RepositoryTaskActivities();
                        var activities = repositoryTaskActivities.GetByTaskId(tsk.Task.TSK_ID);
                        var firstActivity = true;
                        foreach (var act in activities)
                        {
                            act.TSA_TRADE = tsk.Trade;
                            if (tsk.ActivePlanningDate != null)
                            {
                                act.TSA_SCHFROM = tsk.ActivePlanningDate.Value;
                                act.TSA_SCHTO = tsk.ActivePlanningDate.Value;
                            }

                            repositoryTaskActivities.SaveOrUpdate(act);

                            if (firstActivity)
                            {
                                if (tsk.ServiceCode != null)
                                {
                                    var repositoryTaskActivityServiceCodes = new RepositoryTaskActivityServiceCodes();
                                    repositoryTaskActivityServiceCodes.SaveOrUpdate(new TMTASKACTIVITYSERVICECODES
                                    {
                                        ASR_ACTIVITY = (int)act.TSA_ID,
                                        ASR_SERVICECODE = tsk.ServiceCode.SRV_CODE,
                                        ASR_CREATED = DateTime.Now,
                                        ASR_CREATEDBY = act.TSA_CREATEDBY,
                                        ASR_QUANTITY = 1,
                                        ASR_CURRENCY = tsk.ServiceCode.SRV_CURRENCY,
                                        ASR_RECORDVERSION = 0
                                    });
                                }

                                firstActivity = false;
                            }
                        }
                    }
                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = tsk.Values,
                        ErrMsg = exc.Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstoftasks.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }

        public List<ErrLine> Delete(List<TaskModel> lstoftasks, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstoftasks.Count; i++)
            {
                TaskModel tsk = lstoftasks[i];
                try
                {
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    var session = NHibernateSessionManager.Instance.GetSession();
                    IQuery query = session.CreateSQLQuery("EXEC TM_DELETE_TASK @pTask=:task");
                    query.SetInt64("task", tsk.Task.TSK_ID);
                    query.ExecuteUpdate();
                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = tsk.Values,
                        ErrMsg = exc.Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstoftasks.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }

        public override TMTASKS SaveOrUpdate(TMTASKS p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p);

                var repositoryTaskDefaultTrades = new RepositoryTaskDefaultTrades();
                var trade = repositoryTaskDefaultTrades.GetByTaskTypeAndBranch(p.TSK_TASKTYPE, p.TSK_BRANCH);

                IQuery query = session.CreateSQLQuery("EXEC TM_CREATETASKACT @ptask=:task, @ptype=:type, @pstatus=:status, @pTrade=:trade");
                query.SetInt64("task", p.TSK_ID);
                query.SetString("type", p.TSK_TYPE);
                query.SetString("status", p.TSK_STATUS);
                query.SetString("trade", trade?.DTR_TRADE);

                query.ExecuteUpdate();

                session.DeleteAndFlush("FROM TMTASKACTIVITYUSERS p WHERE p.TUS_TYPE = 'FOLLOWED' AND p.TUS_TASK = ?", p.TSK_ID, NHibernateUtil.Int64);
                if (p.TSK_FOLLOWED != null)
                {
                    foreach (var tus in p.TSK_FOLLOWED.Split(','))
                    {
                        session.Save(new TMTASKACTIVITYUSERS
                        {
                            TUS_TYPE = "FOLLOWED",
                            TUS_TASK = p.TSK_ID,
                            TUS_USER = tus,
                            TUS_LINE = 0,
                            TUS_CREATED = DateTime.Now
                        });
                    }
                }

                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveRating(TMTASKS p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TABCNT> GetTabCounts(long task)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_TASKTABCOUNTS @pTask=:task");
                query.SetInt64("task", task);
                var lstcnt = query.SetResultTransformer(Transformers.AliasToBean(typeof(TABCNT))).List<TABCNT>();
                session.EvictAll<TABCNT>();
                return lstcnt;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TaskContactInformation> GetTaskContactInfo(int task)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT * FROM dbo.GetTaskContactInformation(:task)");
                query.SetInt32("task", task);
                var contactinfo = query.SetResultTransformer(Transformers.AliasToBean(typeof(TaskContactInformation))).List<TaskContactInformation>();
                session.EvictAll<TaskContactInformation>();
                return contactinfo;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKPRICING> ListTaskPricing(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKPRICING>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKACTIVITYPARTINTVIEW> ListPartIntegrationView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKACTIVITYPARTINTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKACTIVITYSERVICEINTVIEW> ListServiceIntegrationView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKACTIVITYSERVICEINTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool GeneratePricing(long task)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GENERATE_TASKPRICING @pTask=:task");
                query.SetInt64("task", task);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool UpdateEquipment(long task, long eqpid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_CHANGETASKEQUIPMENT @pTaskId=:task, @pEqpId=:eqpid");
                query.SetInt64("task", task);
                query.SetInt64("eqpid", eqpid);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSYSCODEEXT> GetTaskTypes(string tasktypes)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMSYSCODEEXT>();
                if (!string.IsNullOrEmpty(tasktypes))
                {
                    IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETTASKTYPES]('{0}')", tasktypes));
                    return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMSYSCODEEXT))).List<TMSYSCODEEXT>();
                }
                return null;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMTASKRATINGREVIEWS GetReview(int tskid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                bool exist = session.Query<TMTASKRATINGREVIEWS>()
                            .Where(x => x.TRR_TSKID == tskid)
                            .Select(x => x.TRR_TSKID).Any();
                if (exist)
                {
                    return session.Query<TMTASKRATINGREVIEWS>().Where(x => x.TRR_TSKID == tskid).FirstOrDefault();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveReview(TMTASKRATINGREVIEWS r)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(r);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMTASKPRINTVIEW PrintView(int pTask)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMTASKPRINTVIEW>().Where(x => x.TSK_ID == pTask).SingleOrDefault();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKPRICINGPRINTVIEW> PricingPrintView(int pTask)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMTASKPRICINGPRINTVIEW>().Where(x => x.TPR_TASK == pTask).List();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveList(TMTASKS[] mTasks)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in mTasks)
                {
                    session.SaveOrUpdateAndEvict(r);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}