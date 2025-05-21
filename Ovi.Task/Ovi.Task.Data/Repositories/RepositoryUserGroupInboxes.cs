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
    public class RepositoryUserGroupInboxes : BaseRepository<TMUSERGROUPINBOXES, long>
    {
        public bool Save(string usergroup, TMUSERGROUPINBOXES[] listugi)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMUSERGROUPINBOXES ugi WHERE ugi.UGI_USERGROUP = ?", usergroup, NHibernateUtil.String);

                foreach (var inbox in listugi)
                    session.SaveOrUpdateAndEvict(inbox);

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMUSERGROUPINBOXES> GetByUserGroup(string[] usergroups)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMUSERGROUPINBOXES>()
                    .Where(x => x.UGI_USERGROUP.IsIn(usergroups)).List();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}