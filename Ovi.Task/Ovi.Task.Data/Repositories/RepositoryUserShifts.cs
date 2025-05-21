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
    public class RepositoryUserShifts : BaseRepository<TMUSERSHIFTS, long>
    {
        public IList<TMUSERSHIFTS> ListMonthlyShifts(int year, int month, string user)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETMONTHLYSHIFTS @pYear=:year, @pMonth=:month, @pUser=:user");
                query.SetInt32("year", year);
                query.SetInt32("month", month);
                query.SetString("user", user);
                var lstusershifts = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMUSERSHIFTS))).List<TMUSERSHIFTS>();
                session.EvictAll<TMUSERSHIFTS>();
                return lstusershifts;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}