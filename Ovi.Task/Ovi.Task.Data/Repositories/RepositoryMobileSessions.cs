using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryMobileSessions : BaseRepository<TMMOBILESESSIONS, int>
    {
        public TMMOBILESESSIONS GetBySessId(string id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var sess = session.QueryOver<TMMOBILESESSIONS>()
                    .Where(x => x.SES_SESSID == id)
                    .FutureValue<TMMOBILESESSIONS>().Value;
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
