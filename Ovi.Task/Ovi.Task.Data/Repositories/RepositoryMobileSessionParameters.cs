using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NHibernate;
using NHibernate.Type;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryMobileSessionParameters : BaseRepository<TMMOBILESESSIONPARAMETERS, int>
    {
        public IList<TMMOBILESESSIONPARAMETERS> GetBySessionId(string sessid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lst = session.QueryOver<TMMOBILESESSIONPARAMETERS>().Where(x => x.SPR_SESSID == sessid).List();
                session.EvictAll<TMMOBILESESSIONPARAMETERS>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
