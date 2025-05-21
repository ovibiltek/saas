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
    public class RepositoryMeterReadings : BaseRepository<TMMETERREADINGS, long>
    {
        public IList<TMMETERREADINGSVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMMETERREADINGSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCOMPENSATIONVIEW> ListCompensation(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMCOMPENSATIONVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveList(TMMETERREADINGS[] p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in p)
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