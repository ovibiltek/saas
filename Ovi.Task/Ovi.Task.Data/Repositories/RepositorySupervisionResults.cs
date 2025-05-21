using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Supervision;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySupervisionResults : BaseRepository<TMSUPERVISIONRESULTS, long>
    {
        public bool SaveList(TMSUPERVISIONRESULTS[] p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in p)
                    session.SaveOrUpdateAndEvict(r);

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
