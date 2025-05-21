using System;
using System.Collections.Generic;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Abstract
{
    public abstract class BaseRepository<T1, TId> : ISimpleRepository<T1, TId> where T1 : class
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


        public virtual T1 SaveOrUpdate(T1 p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p);
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public virtual T1 SaveOrUpdate(T1 p, bool isInsert)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, isInsert);
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public virtual bool DeleteById(TId id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var metadata = session.SessionFactory.GetClassMetadata(typeof(T1));
                var hql = string.Format("delete {0} where id = :id", metadata.EntityName);
                var results = session.CreateQuery(hql).SetParameter("id", id).ExecuteUpdate();
                return (results == 1);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public virtual bool DeleteByEntity(T1 entity)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush(entity);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
