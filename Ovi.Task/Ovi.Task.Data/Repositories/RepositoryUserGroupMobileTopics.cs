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
    public class RepositoryUserGroupMobileTopics : BaseRepository<TMUSERGROUPMOBILETOPICS, long>
    {
        public bool Save(string usergroup, TMUSERGROUPMOBILETOPICS[] types)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMUSERGROUPMOBILETOPICS uk WHERE uk.UGM_USERGROUP = ?", usergroup, NHibernateUtil.String);
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

        public IList<TMUSERGROUPMOBILETOPICS> GetByUserGroup(string[] usergroups)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lstugk = session.QueryOver<TMUSERGROUPMOBILETOPICS>().Where(x => x.UGM_USERGROUP.IsIn(usergroups)).List();
                session.EvictAll<TMUSERGROUPMOBILETOPICS>();
                return lstugk;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}