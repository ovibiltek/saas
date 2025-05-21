using System;
using System.Collections.Generic;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.Quotation;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryQuotations : BaseRepository<TMQUOTATIONS, long>
    {
        public IList<TMQUOTATIONSVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMQUOTATIONSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMQUOTATIONLINESVIEW> ListLinesView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMQUOTATIONLINESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }


        public IList<TMQUOTATIONLINEDETAILSVIEW> ListLineDetailsView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMQUOTATIONLINEDETAILSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMQUOTATIONLINEHISTORY> HistoryLinesView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMQUOTATIONLINEHISTORY>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMQUOTATIONSVIEW GetView(long quotation)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMQUOTATIONSVIEW>()
                    .Where(x => x.QUO_ID == quotation)
                    .FutureValue<TMQUOTATIONSVIEW>().Value;
                session.EvictAll<TMQUOTATIONSVIEW>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TABCNT> GetTabCounts(long quotation)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_QUOTATIONTABCOUNTS @pQuotation=:quotation");
                query.SetInt64("quotation", quotation);
                var lstcnt = query.SetResultTransformer(Transformers.AliasToBean(typeof(TABCNT))).List<TABCNT>();
                session.EvictAll<TABCNT>();
                return lstcnt;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMQUOTATIONDURATIONS> QuotationStatusDurations(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMQUOTATIONDURATIONS>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<QUOTATIONFORMAT2> GetFormat2List(long quotation)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETQUOTATIONFORM2 @quo = :quotation");
                query.SetInt64("quotation", quotation);
                var lsttradeusers = query.SetResultTransformer(Transformers.AliasToBean(typeof(QUOTATIONFORMAT2))).List<QUOTATIONFORMAT2>();
                return lsttradeusers;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}