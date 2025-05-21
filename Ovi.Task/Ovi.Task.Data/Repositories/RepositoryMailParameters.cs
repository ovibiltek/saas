using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryMailParameters : BaseRepository<TMMAILPARAMS, long>
    {
        public IList<TMMAILPARAMS> ListByMail(long mailid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMMAILPARAMS>()
                        .Where(x => x.PR_MAILID == mailid).List();
                session.EvictAll<TMMAILPARAMS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}