using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryLabors : BaseRepository<TMLABORS, long>
    {
        public bool UpdateLaborTotal(TMLABORS p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p);
                IQuery query = session.CreateSQLQuery("EXEC TM_UPDATELABORTOTAL @plab=:lab");
                query.SetInt64("lab", p.LAB_ID);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}