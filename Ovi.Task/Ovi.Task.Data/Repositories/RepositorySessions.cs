using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySessions : BaseRepository<TMSESSIONS, long>
    {
        public TMSESSIONS GetBySessId(string id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var sess = session.QueryOver<TMSESSIONS>()
                    .Where(x => x.TMS_SESSID == id)
                    .FutureValue<TMSESSIONS>().Value;
                session.Evict(sess);
                return sess;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}