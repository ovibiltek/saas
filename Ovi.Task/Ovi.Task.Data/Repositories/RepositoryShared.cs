using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryShared<T> where T : class
    {
        public static long Count(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<T>();
                var criteria = CriteriaHelper<T>.Count(session, krg);
                return criteria.UniqueResult<long>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}