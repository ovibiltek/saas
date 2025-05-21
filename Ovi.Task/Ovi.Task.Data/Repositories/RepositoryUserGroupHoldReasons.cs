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
    public class RepositoryUserGroupHoldReasons : BaseRepository<TMUSERGROUPHOLDREASONS, long>
    {
        public bool Save(string usergroup, TMUSERGROUPHOLDREASONS[] types)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMUSERGROUPHOLDREASONS uh WHERE uh.UGH_USERGROUP = ?", usergroup, NHibernateUtil.String);
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

        public IList<TMUSERGROUPHOLDREASONS> GetByUserGroup(string[] usergroups)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lstugh = session.QueryOver<TMUSERGROUPHOLDREASONS>().Where(x => x.UGH_USERGROUP.IsIn(usergroups)).List();
                session.EvictAll<TMUSERGROUPHOLDREASONS>();
                return lstugh;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}