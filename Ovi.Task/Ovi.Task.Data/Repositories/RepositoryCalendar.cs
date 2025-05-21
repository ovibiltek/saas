using NHibernate;
using NHibernate.Criterion;
using NHibernate.Transform;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using Ovi.Task.Data.Entity.Task;
using System.Data;
using NPOI.OpenXmlFormats.Dml.Diagram;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCalendar
    {
        public IList<TMCALENDARVIEW> List(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMCALENDARVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public object ListByCustomer(int year, int week, string customer, string[] organizations)
        {
            try
            {
                var customers = customer.Split(',');
                var session = NHibernateSessionManager.Instance.GetSession();
                var lquery = session.QueryOver<TMCALENDARVIEW>()
                    .Where(x => x.TCA_WEEK == week)
                    .And(x => x.TCA_YEAR == year)
                    .And(x => x.TCA_ORGANIZATION.IsIn(organizations))
                    .And(x => x.TCA_CUSCODE.IsIn(customers));

                session.EvictAll<TMCALENDARVIEW>();
                return lquery.List();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCALENDARVIEW> ListByType(int year, int week, string type, string user, string[] relatedarr)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_CALENDARITEMS_02 @PYEAR=:year, @PWEEK=:week, @PTYPES=:types, @PUSER=:user, @PRELATED=:related");

                

                var dtRelated = new DataTable();
                dtRelated.Columns.Add("CODE", typeof(string));
                foreach (var related in relatedarr)
                {
                    var row = dtRelated.NewRow();
                    row["CODE"] = related;
                    dtRelated.Rows.Add(row);
                }

                query.SetInt32("year", year);
                query.SetInt32("week", week);
                query.SetString("types", type);
                query.SetString("user", user);
                query.SetStructured("related", dtRelated);

                var lstcal = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCALENDARVIEW))).List<TMCALENDARVIEW>();
                session.EvictAll<TMCALENDARVIEW>();
                return lstcal;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<SPWeeklyTradeUsers> GetWeeklyTradeUsers(int year, int week)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_TRADEUSERSOFWEEK @pYear=:year, @pWeek=:week");
                query.SetInt32("year", year);
                query.SetInt32("week", week);
                var lsttradeusers = query.SetResultTransformer(Transformers.AliasToBean(typeof(SPWeeklyTradeUsers))).List<SPWeeklyTradeUsers>();
                return lsttradeusers;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDAILYPLAN> GetDailyPlan(char type, DateTime date)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETDAILYPLAN @PTYPE=:type, @PDATE=:date");
                query.SetCharacter("type", type);
                query.SetDateTime("date", date);
                var lstplan = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMDAILYPLAN))).List<TMDAILYPLAN>();
                session.EvictAll<TMDAILYPLAN>();
                return lstplan;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCALENDARVIEW> ListNotCompletedByDepartment(string department, string[] organizations)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMCALENDARVIEW>();
                var criteria = session.CreateCriteria<TMCALENDARVIEW>();
                criteria.Add(Restrictions.Or(Restrictions.Eq("TCA_DEPARTMENT", department), Restrictions.Eq("TCA_TSKDEPARTMENT", department)));
                criteria.Add(Restrictions.Not(Restrictions.Eq("TCA_PSTATUS", "C")));
                criteria.Add(Restrictions.In("TCA_ORGANIZATION", organizations));
                return criteria.List<TMCALENDARVIEW>();
                ;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<object[]> ListTaskCountsByDYM(string department, int year, int month, string[] organizations)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TM_TASKCOUNTS>();

                var criteria = session.CreateCriteria<TM_TASKCOUNTS>();
                var projList = Projections.ProjectionList();
                projList.Add(Projections.GroupProperty("TCA_DATE"));
                projList.Add(Projections.Sum("TCA_COUNT"));
                criteria.Add(Restrictions.Or(Restrictions.Eq("TCA_DEPARTMENT", department), Restrictions.Eq("TCA_TSKDEPARTMENT", department)));
                criteria.Add(Restrictions.Eq("TCA_YEAR", year));
                criteria.Add(Restrictions.Eq("TCA_MONTH", month));
                criteria.Add(Restrictions.In("TCA_ORGANIZATION", organizations));
                criteria.SetProjection(projList);
                return criteria.List<object[]>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCALENDARVIEW> ListMonthlyTasks(string caller, string user, int year, int month)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_CALENDARITEMS_03 @PYEAR=:year, @PMONTH=:month, @PUSER=:user, @PCALLER=:caller");
                query.SetInt32("year", year);
                query.SetInt32("month", month);
                query.SetString("user", user);
                query.SetString("caller", caller);
                var lstcal = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCALENDARVIEW))).List<TMCALENDARVIEW>();
                session.EvictAll<TMCALENDARVIEW>();
                return lstcal;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCALENDARVIEW> ListOnlyAssignedTasksActualOrPlannedByUYM(string user, int year, int month, string[] organizations)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMCALENDARVIEW>();

                var criteria = session.CreateCriteria<TMCALENDARVIEW>();
                criteria.Add(Restrictions.Eq("TCA_RELATEDUSER", user));
                criteria.Add(Restrictions.Eq("TCA_YEAR", year));
                criteria.Add(Restrictions.Eq("TCA_MONTH", month));
                criteria.Add(Restrictions.Eq("TCA_TYPE", "ASSIGNED"));
                criteria.Add(Restrictions.In("TCA_ORGANIZATION", organizations));
                criteria.Add(Restrictions.Or(Restrictions.Gt("TCA_ACTUALHOURS", decimal.Zero),
                    Restrictions.Gt("TCA_PLANNEDHOURS", decimal.Zero)));
                return criteria.List<TMCALENDARVIEW>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCALENDARVIEW> ListTasksByDD(string department, DateTime date, string[] organizations)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMCALENDARVIEW>();

                var criteria = session.CreateCriteria<TMCALENDARVIEW>();
                criteria.Add(Restrictions.Or(Restrictions.Eq("TCA_DEPARTMENT", department), Restrictions.Eq("TCA_TSKDEPARTMENT", department)));
                criteria.Add(Restrictions.Eq("TCA_DATE", date));
                criteria.Add(Restrictions.In("TCA_ORGANIZATION", organizations));
                criteria.Add(Restrictions.Not(Restrictions.Eq("TCA_PSTATUS", "C")));
                return criteria.List<TMCALENDARVIEW>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<TMCALENDARVIEW> ListByUser(string usercode, DateTime dt, string[] organizations)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_CALENDARITEMS_01 @RELATEDUSER=:relateduser, @PFROM=:from, @PTO=:to");
                query.SetString("relateduser", usercode);
                query.SetDateTime("from", dt.AddDays(-7));
                query.SetDateTime("to", dt.AddDays(7));
                var lstcal = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCALENDARVIEW))).List<TMCALENDARVIEW>();
                var result = (from c in lstcal
                              where organizations.Contains(c.TCA_ORGANIZATION)
                              select c).ToList();

                return result;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool MoveTask(string unit, string user, long id, long line, string date)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_UPDTASK @punit=:unit, @puser=:user, @pid=:id, @pline= :line, @pdate=:date ");
                query.SetString("unit", unit);
                query.SetString("user", user);
                query.SetInt64("id", id);
                query.SetInt64("line", line);
                query.SetString("date", date);
                query.ExecuteUpdate();

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}