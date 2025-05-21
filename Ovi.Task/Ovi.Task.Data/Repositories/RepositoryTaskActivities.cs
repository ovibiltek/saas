using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskActivities : BaseRepository<TMTASKACTIVITIES, long>
    {
        public class ActivityEndTMSModel
        {
            public virtual long AET_TASK { get; set; }
            public virtual long AET_LINE { get; set; }
            public virtual string AET_ENDTYPE { get; set; }
            public virtual string AET_PNOTE { get; set; }
        }

        public IList<TMTASKACTIVITIESEXTVIEW> ListExt(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKACTIVITIESEXTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMADVPLNTASKACTIVITIES> ListAdvPlnActivities(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMADVPLNTASKACTIVITIES>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }


        public IList<TMTASKACTIVITIES> GetByTaskId(long taskid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTASKACTIVITIES>()
                    .Where(x => x.TSA_TASK == taskid)
                    .List();
                session.EvictAll<TMTASKACTIVITIES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool CheckNecessaryChecklistItems(string id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMCHECKLISTS>();
                return session.QueryOver<TMCHECKLISTS>()
                           .Where(x => x.CHK_SOURCE == id)
                           .And(x => x.CHK_SUBJECT == "TASK")
                           .And(x => x.CHK_NECESSARY == '+')
                           .And(x => x.CHK_CHECKED != '+')
                           .RowCount() > 0;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool ActivityEndTMS(ActivityEndTMSModel taskActivity)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_ACTIVITYENDTMS @pTask=:task, @pLine=:line, @pEndType=:endtype,@pNote=:note");
                query.SetInt64("task", taskActivity.AET_TASK);
                query.SetInt64("line", taskActivity.AET_LINE);
                query.SetString("endtype", taskActivity.AET_ENDTYPE);
                query.SetString("note", taskActivity.AET_PNOTE);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool PutOnHold(ActivityEndTMSModel taskActivity)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_TASKHOLDTMS @pTask=:task, @pLine=:line, @pEndType=:endtype,@pNote=:note");
                query.SetInt64("task", taskActivity.AET_TASK);
                query.SetInt64("line", taskActivity.AET_LINE);
                query.SetString("endtype", taskActivity.AET_ENDTYPE);
                query.SetString("note", taskActivity.AET_PNOTE);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool DeleteByTask(long id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMTASKACTIVITIES p WHERE p.TSA_TASK = ? ", id, NHibernateUtil.Int64);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMADVPLNTASKACTIVITIES GetAdvPlan(long id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                {
                    return session.GetAndEvict<TMADVPLNTASKACTIVITIES>(id);
                }
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMTASKACTIVITIES GetByTaskAndLine(long taskid,int line)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTASKACTIVITIES>()
                    .Where(x => x.TSA_TASK == taskid)
                    .And(x => x.TSA_LINE == line)
                    .FutureValue<TMTASKACTIVITIES>().Value;
                session.EvictAll<TMTASKACTIVITIES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool IsLastActivity(TMTASKACTIVITIES taskActivity)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();

                var activityList = session.QueryOver<TMTASKACTIVITIES>()
                    .Where(x => x.TSA_TASK == taskActivity.TSA_TASK)
                    .List<TMTASKACTIVITIES>();

                var completedActCount = activityList.Where(x => x.TSA_COMPLETED == '+').Count();
                var totalActCount = activityList.Count;

                return (totalActCount == completedActCount);

            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}