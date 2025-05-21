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
    public class RepositoryAudit : BaseRepository<TMAUDIT, long>
    {
        public IList<TMAUDITVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMAUDITVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool Save(TMAUDIT[] auditArr)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in auditArr)
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

        public IList<TMAUDITVIEW> ListAuditView(GridRequest krg)
        {
            try
            {
                var subject = krg.GetFieldValueFromGridRequest("AUD_SUBJECT");
                var source = krg.GetFieldValueFromGridRequest("AUD_SOURCE");
                var secrefid = krg.GetFieldValueFromGridRequest("AUD_SECONDARYREFID");
                var refid = krg.GetFieldValueFromGridRequest("AUD_REFID");

                var parameters = new Dictionary<string, object>
                    {
                        { "AUD_SUBJECT", subject!= null ? subject.Value : null },
                        { "AUD_SOURCE", source!= null ? source.Value : null },
                        { "AUD_SECONDARYREFID", secrefid!= null ? secrefid.Value : null },
                        { "AUD_REFID", refid!= null ? refid.Value : null }
                    };
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMAUDITVIEW>.RunTableValuedFunction(session, "dbo.TMAUDITVIEWFUNC", parameters, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}