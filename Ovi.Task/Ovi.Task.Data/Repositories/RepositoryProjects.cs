using System;
using System.Collections.Generic;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Project;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryProjects : BaseRepository<TMPROJECTS, long>
    {
        public override TMPROJECTS SaveOrUpdate(TMPROJECTS p)
        {
            try
            {
                var isnew = (p.PRJ_ID == 0);
                var session = NHibernateSessionManager.Instance.GetSession();
                if (isnew)
                {
                    var tax2 = new RepositoryParameters().Get("TAX2");
                    if (tax2 != null)
                        p.PRJ_TAX2 = decimal.Parse(tax2.PRM_VALUE, System.Globalization.NumberStyles.Currency,
                            System.Globalization.CultureInfo.InvariantCulture);
                }
                session.SaveOrUpdateAndEvict(p);
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMPROJECTFINANCIALVIEW> GetFinancialView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMPROJECTFINANCIALVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMUSERS GetLastApprover(long project)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_PROJECTLASTAPPROVER @pProject=:project");
                query.SetInt64("project", project);
                var user = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMUSERS))).UniqueResult<TMUSERS>();
                session.EvictAll<TMUSERS>();
                return user;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

    }
}