using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryNotifications : BaseRepository<TMNOTIFICATIONS, string>
    {
        public IList<TMNOTIFICATIONSCNTVIEW> GetCountList(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMNOTIFICATIONSCNTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMNOTIFICATIONSVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMNOTIFICATIONSVIEW>();
                var criteria = CriteriaHelper<TMNOTIFICATIONSVIEW>.Build(session, krg);
                var lstNotifications = criteria.List<TMNOTIFICATIONSVIEW>();
                return lstNotifications;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMNOTIFICATIONS> ListAll(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMNOTIFICATIONS>();
                var criteria = CriteriaHelper<TMNOTIFICATIONS>.Build(session, krg);
                var lstNotifications = criteria.List<TMNOTIFICATIONS>();
                return lstNotifications;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void UpdateNotificationsAsRead(string subject, string type, string owner)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_PRTMNOTREAD @psubject=:subject, @pType=:type,@pOwner=:owner ");
                query.SetString("subject", subject);
                query.SetString("type", type);
                query.SetString("owner", owner);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}