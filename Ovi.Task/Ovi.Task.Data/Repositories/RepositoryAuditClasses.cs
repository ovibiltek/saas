using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryAuditClasses : BaseRepository<TMAUDITCLASSES, int>
    {
        public TMAUDITCLASSES GetByClass(string cls)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMAUDITCLASSES>()
                    .Where(x => x.AUC_CLASS == cls)
                    .FutureValue<TMAUDITCLASSES>().Value;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}