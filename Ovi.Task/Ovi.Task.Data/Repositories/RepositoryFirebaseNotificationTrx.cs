using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryFirebaseNotificationTrx : BaseRepository<TMFIREBASENOTIFICATIONTRX, int>
    {
        public void Save(TMFIREBASENOTIFICATIONTRX trx)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.Save(trx);
                session.Flush();
                
            }
            catch (Exception e)
            {
                throw new Exception(e.InnerException.InnerException.Message, e);
            }
        }
    }
}