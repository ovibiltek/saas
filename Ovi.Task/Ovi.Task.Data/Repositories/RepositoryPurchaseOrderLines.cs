using System;
using System.Collections.Generic;
using System.Linq;
using NHibernate;
using NHibernate.SqlCommand;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPurchaseOrderLines : BaseRepository<TMPURCHASEORDERLINES, long>
    {
        public TMPOLINESUMMARYVIEW GetRemaining(TMPOLINESUMMARYVIEW model)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMPOLINESUMMARYVIEW>().
                    Where(x=>x.PLS_PORID == model.PLS_PORID)
                    .And(x=>x.PLS_LINE == model.PLS_LINE)
                    .SingleOrDefault();
                session.EvictAll<TMPOLINESUMMARYVIEW>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMPOLINESUMMARYVIEW> GetRemainingByPO(long po)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMPOLINESUMMARYVIEW>().
                    Where(x => x.PLS_PORID == po)
                    .List();
                session.EvictAll<TMPOLINESUMMARYVIEW>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMPURCHASEORDERLINETRACK> GetPurchaseOrderLineTracks(TMPURCHASEORDERLINETRACK mTMPurchaseOrderLineTrack)
        {
            var session = NHibernateSessionManager.Instance.GetSession();
            var l = session.QueryOver<TMPURCHASEORDERLINETRACK>().Where(x=>x.PRT_PORID == mTMPurchaseOrderLineTrack.PRT_PORID).List();
            session.EvictAll<TMPURCHASEORDERLINETRACK>();
            return l;
        }

        public IList<TMPURCHASEORDERLINEVIEW> GetLines(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMPURCHASEORDERLINEVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}