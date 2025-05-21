using NHibernate.Criterion;
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
    public class RetrieveByAuthParams
    {
        public string Entity { get; set; }

        public string Fromcode { get; set; }

        public string Typ { get; set; }

        public string MDepartment { get; set; }

        public string TDepartment { get; set; }

        public string Usergroup { get; set; }

        public string RequestedBy { get; set; }

        public string CreatedBy { get; set; }

        public string SystemUser { get; set; }
    }

    public class RepositoryStatusAuth : BaseRepository<TMSTATUSAUTH, long>
    {
        public IList<TMSTATUSAUTHVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSTATUSAUTHVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSTATUSAUTHVIEW> RetrieveByAuth(RetrieveByAuthParams retrieveByAuthParams)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMSTATUSAUTHVIEW>();

                var repositoryUsers = new RepositoryUsers();
                TMUSERS rby = null;
                if (!string.IsNullOrEmpty(retrieveByAuthParams.RequestedBy))
                {
                    rby = repositoryUsers.Get(retrieveByAuthParams.RequestedBy);
                }

                var repositoryDepartments = new RepositoryDepartments();
                TMDEPARTMENTS rbyd = null;
                TMDEPARTMENTS tskd = null;

                // Requestor's Department
                if (rby != null && !string.IsNullOrEmpty(rby.USR_DEPARTMENT))
                {
                    rbyd = repositoryDepartments.Get(rby.USR_DEPARTMENT);
                }

                // Task's Department
                if (!string.IsNullOrEmpty(retrieveByAuthParams.TDepartment))
                {
                    tskd = repositoryDepartments.Get(retrieveByAuthParams.TDepartment);
                }

                var criteria = session.CreateCriteria<TMSTATUSAUTHVIEW>();
                criteria.Add(Restrictions.Or(Restrictions.Eq("SAU_DEPARTMENT", "ALL"),
                    Restrictions.Or(
                        Restrictions.And(Restrictions.Eq("SAU_DEPARTMENT", "MYDEP"), Expression.Sql(string.Format("'{0}' = '{1}'", retrieveByAuthParams.MDepartment, retrieveByAuthParams.TDepartment))),
                        Restrictions.And(Restrictions.Eq("SAU_DEPARTMENT", "NOTMY"), Expression.Sql(string.Format("'{0}' <> '{1}'", retrieveByAuthParams.MDepartment, retrieveByAuthParams.TDepartment))))));

                criteria.Add(Restrictions.Eq("SAU_FROM", retrieveByAuthParams.Fromcode));
                criteria.Add(Restrictions.In("SAU_TYPE", new object[] { "*", retrieveByAuthParams.Typ }));

                var or1 = Restrictions.In("SAU_AUTHORIZED", new object[] { "*", "XALL", retrieveByAuthParams.Usergroup });

                AbstractCriterion a1 = null;
                if (!string.IsNullOrEmpty(retrieveByAuthParams.RequestedBy))
                {
                    a1 = Restrictions.And(Restrictions.Eq("SAU_AUTHORIZED", "XREQ"),
                        Expression.Sql(string.Format("'{0}' = '{1}'", retrieveByAuthParams.RequestedBy,
                            retrieveByAuthParams.SystemUser)));
                }

                AbstractCriterion a2 = null;
                if (!string.IsNullOrEmpty(retrieveByAuthParams.CreatedBy))
                {
                    a2 = Restrictions.And(Restrictions.Eq("SAU_AUTHORIZED", "XCRB"),
                        Expression.Sql(string.Format("'{0}' = '{1}'", retrieveByAuthParams.CreatedBy,
                            retrieveByAuthParams.SystemUser)));
                }

                AbstractCriterion a3 = null;
                if (rbyd != null)
                {
                    a3 = Restrictions.And(Restrictions.Eq("SAU_AUTHORIZED", "XRLM"),
                        Expression.Sql(string.Format("'{0}' IN ('{1}','{2}')", retrieveByAuthParams.SystemUser, rbyd.DEP_MANAGER, rbyd.DEP_AUTHORIZED)));
                }

                AbstractCriterion a4 = null;
                if (tskd != null)
                {
                    a4 = Restrictions.And(Restrictions.Eq("SAU_AUTHORIZED", "XDLM"),
                        Expression.Sql(string.Format("'{0}' IN ('{1}','{2}')", retrieveByAuthParams.SystemUser, tskd.DEP_MANAGER, tskd.DEP_AUTHORIZED)));
                }

                AbstractCriterion cac1 = null;
                if (a1 != null && a2 != null)
                {
                    cac1 = Restrictions.Or(a1, a2);
                }
                else if (a1 != null)
                {
                    cac1 = a1;
                }

                AbstractCriterion cac2 = null;
                if (a3 != null && a4 != null)
                {
                    cac2 = Restrictions.Or(a3, a4);
                }
                else if (a3 != null)
                {
                    cac2 = a3;
                }

                if (cac1 != null && cac2 != null)
                {
                    criteria.Add(Restrictions.Or(or1, Restrictions.Or(cac1, cac2)));
                }
                else
                {
                    criteria.Add(or1);
                }

                criteria.Add(Restrictions.Eq("SAU_ENTITY", retrieveByAuthParams.Entity));
                criteria.Add(Restrictions.Eq("SAU_ACTIVE", '+'));

                return criteria.List<TMSTATUSAUTHVIEW>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMSTATUSAUTH DefaultStatus(string entity, string type, string from, string usrgroup)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMSTATUSAUTH>()
                    .Where(x => x.SAU_ENTITY == entity)
                    .And(x => x.SAU_TYPE == type)
                    .And(x => x.SAU_FROM == from)
                    .And(x => x.SAU_AUTHORIZED == usrgroup)
                    .FutureValue<TMSTATUSAUTH>().Value;
                session.EvictAll<TMSTATUSAUTH>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}