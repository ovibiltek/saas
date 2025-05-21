using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryMessages : BaseRepository<TMMSGS, long>
    {
        public TMMSGS Get(string code, string language)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMMSGS>()
                    .Where(x => x.MSG_CODE == code)
                    .And(x => x.MSG_LANG == language)
                    .FutureValue<TMMSGS>().Value;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public static IList<TMMSGS> ListByLanguage(string language)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMMSGS>()
                        .Where(x => x.MSG_LANG == language)
                        .List();
                session.EvictAll<TMMSGS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}