using NHibernate;
using NHibernate.Criterion;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryUserGroupKPIs : BaseRepository<TMUSERGROUPKPIS, long>
    {
        public bool Save(string usergroup, TMUSERGROUPKPIS[] types)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMUSERGROUPKPIS uk WHERE uk.UGK_USERGROUP = ?", usergroup, NHibernateUtil.String);
                foreach (var t in types)
                {
                    session.SaveOrUpdateAndEvict(t);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMUSERGROUPKPIS> GetByUserGroup(string[] usergroups)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lstugk = session.QueryOver<TMUSERGROUPKPIS>().Where(x => x.UGK_USERGROUP.IsIn(usergroups)).List();
                session.EvictAll<TMUSERGROUPKPIS>();
                return lstugk;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}