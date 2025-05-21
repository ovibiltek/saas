using System;
using System.Collections.Generic;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Supervision;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryReporting : BaseRepository<TMREPORTING, int>
    {
        public IList<TMREPORTINGVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMREPORTINGVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}