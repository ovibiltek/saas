using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryUserAnnualLeaves : BaseRepository<TMUSERANNUALLEAVES, long>
    {
        public TMUSERANNUALLEAVESSUMMARY GetByUser(string user)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var o = session.QueryOver<TMUSERANNUALLEAVESSUMMARY>()
                    .Where(x => x.UAL_USER == user)
                    .FutureValue<TMUSERANNUALLEAVESSUMMARY>()
                    .Value;
                session.Evict(o);
                return o;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}