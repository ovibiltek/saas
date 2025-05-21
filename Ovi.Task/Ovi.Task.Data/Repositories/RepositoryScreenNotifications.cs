using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryScreenNotifications : BaseRepository<TMSCREENNOTIFICATIONS, long>
    {
        public bool DoNotShowAgain(TMSCREENNOTIFICATIONS notification)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdate(new TMSCREENNOTIFICATIONSTRX
                {
                    NTR_CREATED = DateTime.Now,
                    NTR_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code,
                    NTR_USER = ContextUserHelper.Instance.ContextUser.Code,
                    NTR_NOTID = notification.NOT_ID
                });

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
