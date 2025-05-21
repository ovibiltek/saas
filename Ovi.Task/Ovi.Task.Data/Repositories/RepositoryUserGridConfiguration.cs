using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryUserGridConfiguration : BaseRepository<TMUSERGRIDCONFIGURATION, long>
    {
        public bool SaveCustom(UserGridConfiguration p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMUSERGRIDCONFIGURATION ug WHERE ug.UGC_GRID = ? AND ug.UGC_USER = ?",
                    new object[] { p.Grid, p.User }, new[] { NHibernateUtil.String, NHibernateUtil.String });

                foreach (var r in p.UserGridConfigurationList)
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