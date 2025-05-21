using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryProgressPaymentPricing : BaseRepository<TMPROGRESSPAYMENTPRICING, long>
    {
        public IList<TMPROGRESSPAYMENTPRICING> ListByProgressPayment(long progressPayment)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var list = session.QueryOver<TMPROGRESSPAYMENTPRICING>()
                    .Where(x => x.PRC_PSPCODE == progressPayment)
                    .OrderBy(x => x.PRC_TASK).Desc
                    .ThenBy(x => x.PRC_ACTLINE).Asc
                    .ThenBy(x => x.PRC_TYPE).Asc
                    .List<TMPROGRESSPAYMENTPRICING>();
                session.EvictAll<TMPROGRESSPAYMENTPRICING>();
                return list;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMPROGRESSPAYMENTPRICING> ListByTask(long taskid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMPROGRESSPAYMENTPRICING>()
                    .Where(x => x.PRC_TASK == taskid)
                    .OrderBy(x => x.PRC_ACTLINE).Asc
                    .ThenBy(x => x.PRC_TYPE).Asc
                    .List<TMPROGRESSPAYMENTPRICING>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool CreateLines(long id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_CREATE_PROGRESSPAYMENT_PRICINGLINES @PSP=:psp");
                query.SetInt64("psp", id);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void Save(TMPROGRESSPAYMENTPRICING[] list)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var item in list)
                {
                    session.SaveOrUpdateAndEvict(item);
                }
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPT_PROGRESSPAYMENTLINES> ListReportPricingLines(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TM_RPT_PROGRESSPAYMENTLINES>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPT_PROGRESSPAYMENTLINES2> ListReportPricingLines2(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TM_RPT_PROGRESSPAYMENTLINES2>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPT_PROGRESSPAYMENTLINES2SUMM> ListReportPricingLines2Summ(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TM_RPT_PROGRESSPAYMENTLINES2SUMM>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}