using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskClosingCodes : BaseRepository<TMTASKCLOSINGCODES, long>
    {
        public TMTASKCLOSINGCODES GetByTask(long taskid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTASKCLOSINGCODES>()
                    .Where(x => x.CLC_TASK == taskid)
                    .FutureValue<TMTASKCLOSINGCODES>().Value;
                session.EvictAll<TMTASKCLOSINGCODES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMCLOSINGCODEREFERENCES GetClosingCodeReference(string customer, string type, string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCLOSINGCODEREFERENCES>()
                    .Where(x => x.CRF_CUSTOMER == customer)
                    .And(x => x.CRF_TYPE == type)
                    .And(x => x.CRF_CODE == code)
                    .FutureValue<TMCLOSINGCODEREFERENCES>().Value;
                session.EvictAll<TMCLOSINGCODEREFERENCES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}