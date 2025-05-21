using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryComments : BaseRepository<TMCOMMENTS, long>
    {
        public IList<TMCOMMENTSVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMCOMMENTSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCOMMENTS> ListBySubjectAndSource(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCOMMENTS>()
                    .Where(x => x.CMN_SUBJECT == subject)
                    .And(x => x.CMN_SOURCE == source)
                    .List();
                session.EvictAll<TMCOMMENTS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMCOMMENTSVIEW GetLastCommentCustomer(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMCOMMENTSVIEW>()
                    .Where(x => x.CMN_SUBJECT == subject)
                    .And(x => x.CMN_SOURCE == source)
                    .And(x => x.CMN_VISIBLETOCUSTOMER == '+')
                    .Take(1)
                    .FutureValue<TMCOMMENTSVIEW>().Value;            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMCOMMENTSVIEW GetViewById(long id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCOMMENTSVIEW>()
                    .Where(x => x.CMN_ID == id)
                    .FutureValue()
                    .Value;
                session.EvictAll<TMCOMMENTSVIEW>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

    }
}