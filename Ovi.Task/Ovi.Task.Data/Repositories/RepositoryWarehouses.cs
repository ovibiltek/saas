using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using NHibernate;
using NHibernate.Linq;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryWarehouses : BaseRepository<TMWAREHOUSES, string>
    {
        public IList<TMSTOCKVIEW> StockView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSTOCKVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSTOCKBYWAREHOUSEVIEW> StockByWarehouse(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSTOCKBYWAREHOUSEVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public string GetWarehouseByWarehouseman(string user, string org)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.GetWarehouseByUser(:user,:org)");
                query.SetString("user", user);
                query.SetString("org", org);
                return query.UniqueResult<string>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public string GetWarehouseByActivity(long task,long activity)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var query = session.CreateSQLQuery("SELECT dbo.GetWarehouseByActivity(:task,:activity)");
                query.SetInt64("task", task);
                query.SetInt64("activity", activity);
                return query.UniqueResult<string>();
            }
            catch (Exception e)
            {

                 throw ExceptionHandler.Process(e);
            }
        }
    }
}