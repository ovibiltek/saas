using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskNotifyUsers : BaseRepository<TMTSKNOTIFYUSERS, long>
    {
        public bool Save(long taskid, TMTSKNOTIFYUSERS[] notusers)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMTSKNOTIFYUSERS p WHERE p.NOU_TASK = ?", taskid, NHibernateUtil.Int64);
                foreach (var r in notusers)
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
    }
}