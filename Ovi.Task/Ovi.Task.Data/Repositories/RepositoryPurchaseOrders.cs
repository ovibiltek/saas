using System;
using System.Collections.Generic;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPurchaseOrders : BaseRepository<TMPURCHASEORDERS, long>
    {
        public IList<TABCNT> GetTabCounts(long porid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_PURCHASEORDERSTABCOUNTS @pPorID=:porid");
                query.SetInt64("porid", porid);
                var lstcnt = query.SetResultTransformer(Transformers.AliasToBean(typeof(TABCNT))).List<TABCNT>();
                session.EvictAll<TABCNT>();
                return lstcnt;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}