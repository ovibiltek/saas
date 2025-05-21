using NHibernate.Criterion;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskActivityRevisions : BaseRepository<TMTASKACTIVITYREVISIONS, string>
    {
        public int GetNextNo(long task, decimal line)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMTASKACTIVITYREVISIONS>();
                var latestno = session.QueryOver<TMTASKACTIVITYREVISIONS>()
                    .Where(x => x.REV_TASK == task)
                    .And(x => x.REV_LINE == line)
                    .Select(Projections.RowCount())
                    .FutureValue<int>()
                    .Value;
                return (latestno + 1);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKACTIVITYREVISIONS> ListByTaskAndLine(long task, decimal line)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTASKACTIVITYREVISIONS>()
                    .Where(x => x.REV_TASK == task)
                    .And(x => x.REV_LINE == line)
                    .List();
                session.EvictAll<TMTASKACTIVITYREVISIONS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}