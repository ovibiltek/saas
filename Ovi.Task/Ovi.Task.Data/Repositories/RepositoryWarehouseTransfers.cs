using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryWarehouseTransfers : BaseRepository<TMWAREHOUSETRANSFERS, long>
    {
        //public bool PerformProcess()
        //{
        //    try
        //    {
        //        var session = NHibernateSessionManager.Instance.GetSession();
        //        IQuery query = session.CreateSQLQuery("EXEC TM_WAREHOUSETOWAREHOUSE");
        //        query.ExecuteUpdate();
        //        return true;
        //    }
        //    catch (Exception e)
        //    {
        //        throw ExceptionHandler.Process(e);
        //    }
        //}
    }
}