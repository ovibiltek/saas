using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using NHibernate.Transform;
using Ovi.Task.Data.Entity.Invoice;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryInvoices : BaseRepository<TMINVOICES, long>
    {
        public IList<TMINVOICELINESVIEW> ListLines(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMINVOICELINESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMMIKROINVLINESVIEW> ListMikroLines(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMMIKROINVLINESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMMIKROSALESINVOICELINESVIEW> ListMikroSalesLines(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMMIKROSALESINVOICELINESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMINVOICERETURNLINESDETAILSVIEW> InvoiceLineDetails(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMINVOICERETURNLINESDETAILSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSUPPLIERINVOICELINEDETAILSVIEW> ListLineDetails(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSUPPLIERINVOICELINEDETAILSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool RemoveLineFromInvoice(long activityid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REMOVELINEFROMINVOICE @PACTIVITY=:activity");
                query.SetInt64("activity", activityid);
                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSPCRNTPSBINVAMNTVIEW> SolutionPartnerCrntPsbInvAmntList(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSPCRNTPSBINVAMNTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMINVOICEEXT> GetInvoices(string invoices)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMINVOICEEXT>();
                if (!string.IsNullOrEmpty(invoices))
                {
                    IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETINVOICES]('{0}')", invoices));
                    return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMINVOICEEXT))).List<TMINVOICEEXT>();
                }
                return null;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override TMINVOICES SaveOrUpdate(TMINVOICES pp)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var isnewrecord = pp.INV_CODE == 0;
                session.SaveOrUpdateAndEvict(pp, pp.INV_CODE == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'INVOICE' AND fm.FMP_FIELD = 'RETURNINVOICE' AND fm.FMP_CODE = ?", pp.INV_CODE, NHibernateUtil.String);
                if (pp.INV_RETURNINVOICE != null)
                {
                    foreach (var returninvoice in pp.INV_RETURNINVOICE.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "INVOICE",
                            FMP_FIELD = "RETURNINVOICE",
                            FMP_VALUE = returninvoice,
                            FMP_CODE = pp.INV_CODE.ToString(),
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? pp.INV_CREATEDBY : pp.INV_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                    }
                }

                return pp;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}