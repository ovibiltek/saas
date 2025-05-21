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
    public class RepositoryTypeLevels : BaseRepository<TMTYPELEVELS, int>
    {
        public TMTYPELEVELS GetByCode(string typelevelcode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMTYPELEVELS>()
                    .Where(x => x.TLV_CODE == typelevelcode)
                    .FutureValue<TMTYPELEVELS>().Value;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
