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
    public class RepositoryMenu : BaseRepository<TMMENU, TMMENU>
    {
        public List<TMMENU> ListByUserGroup(string usergroup)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMMENU>();
                var criteria = session.CreateCriteria<TMMENU>();
                criteria.Add(Restrictions.Eq("MNU_USERGROUP", usergroup));
                return criteria.List<TMMENU>() as List<TMMENU>;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveList(TMMENU[] menulist)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in menulist)
                {
                    session.SaveOrUpdateAndEvict(r);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMMENU GetSecurityFilter(string userGroup, string screenScrCode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMMENU>()
                    .Where(x => x.MNU_USERGROUP == userGroup)
                    .And(x => x.MNU_SCREEN == screenScrCode)
                    .FutureValue<TMMENU>().Value;
                session.EvictAll<TMMENU>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}