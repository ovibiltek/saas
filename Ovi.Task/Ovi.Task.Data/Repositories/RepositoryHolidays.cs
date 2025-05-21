using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryHolidays : BaseRepository<TMHOLIDAYS, long>
    {
        public IList<TMHOLIDAYS> ListMonthlyHolidays(int year, int month)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETMONTHLYHOLIDAYS @pYear=:year, @pMonth=:month");
                query.SetInt32("year", year);
                query.SetInt32("month", month);
                var lstcal = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMHOLIDAYS))).List<TMHOLIDAYS>();
                session.EvictAll<TMHOLIDAYS>();
                return lstcal;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}