using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskPartRequests : BaseRepository<TMTSKPARTREQ, long>
    {
        public bool Save(long taskid, TMTSKPARTREQ[] parReqArr)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMTSKPARTREQ p WHERE p.PRQ_TASK = ?", taskid, NHibernateUtil.Int64);
                foreach (var r in parReqArr)
                {
                    session.SaveOrUpdateAndEvict(r);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTSKPARTREQ> GetByTaskId(long tskId)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTSKPARTREQ>().Where(x => x.PRQ_TASK == tskId).List();
                session.EvictAll<TMTSKPARTREQ>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool DeleteByTaskId(long tskId)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMTSKPARTREQ p WHERE p.PRQ_TASK = ?", tskId, NHibernateUtil.Int64);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}