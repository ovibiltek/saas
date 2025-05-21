using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTimekeepingApprovers : BaseRepository<TMTIMEKEEPINGLINEAPPROVERS, long>
    {
        public IList<TMTIMEKEEPINGLINEAPPROVERS> ListByLine(long line)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTIMEKEEPINGLINEAPPROVERS>()
                    .Where(x => x.TKA_LINE == line)
                    .List();
                session.EvictAll<TMTIMEKEEPINGLINEAPPROVERS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}