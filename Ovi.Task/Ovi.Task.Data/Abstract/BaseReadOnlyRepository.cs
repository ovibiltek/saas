using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Abstract
{
    public abstract class BaseReadOnlyRepository<T1, TId> : IReadOnlyRepository<T1, TId> where T1 : class
    {
        public virtual IList<T1> List(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<T1>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public virtual T1 Get(TId id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.GetAndEvict<T1>(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}