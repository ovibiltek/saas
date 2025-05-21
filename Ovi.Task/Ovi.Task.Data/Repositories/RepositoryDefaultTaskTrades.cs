using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskDefaultTrades : BaseRepository<TMTASKDEFAULTTRADES, int>
    {
        public TMTASKDEFAULTTRADES GetByTaskTypeAndBranch(string tasktype, string branch)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTASKDEFAULTTRADES>()
                    .Where(x => x.DTR_TASKTYPE == tasktype)
                    .And(x=>x.DTR_BRANCH == branch)
                    .FutureValue<TMTASKDEFAULTTRADES>().Value;
                session.EvictAll<TMTASKDEFAULTTRADES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}