using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryBatchProgressData : BaseRepository<TMBATCHPROGRESSDATA, int>
    {
        public TMBATCHPROGRESSDATA GetLastRunningByType(string type)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var batchProgressDate = session.QueryOver<TMBATCHPROGRESSDATA>()
                    .Where(x => x.PRG_SESSION == ContextUserHelper.Instance.ContextUser.SessionId)
                    .And(x => x.PRG_BATCH == type)
                    .OrderBy(x => x.PRG_ID).Desc
                    .Take(1)
                    .FutureValue<TMBATCHPROGRESSDATA>()
                    .Value;
                session.Evict(batchProgressDate);
                return batchProgressDate;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool FileExists(string filename)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var batchProgressData = session.QueryOver<TMBATCHPROGRESSDATA>()
                    .Where(x => x.PRG_FILENAME == filename)
                    .Take(1)
                    .FutureValue<TMBATCHPROGRESSDATA>()
                    .Value;
                session.Evict(batchProgressData);
                return batchProgressData != null;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}