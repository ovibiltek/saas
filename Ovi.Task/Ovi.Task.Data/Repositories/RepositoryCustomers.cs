using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using NHibernate.Hql.Classic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomers : BaseRepository<TMCUSTOMERS, string>
    {
        public IList<TMCUSTOMERS> ListByGroup(string group)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lst = session.QueryOver<TMCUSTOMERS>().Where(x => x.CUS_GROUP == group).List();
                session.EvictAll<TMCUSTOMERS>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<CUSTOMEREXT> GetCustomers(string customers, bool showall)
        {
            try
            {
                if (string.IsNullOrEmpty(customers))
                {
                    return null;
                }

                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = (customers.Contains("*") && showall)
                    ? session.CreateSQLQuery("SELECT CUS_CODE,CUS_DESC FROM TMCUSTOMERS WHERE CUS_ACTIVE = '+' AND CUS_CODE <> '*'")
                    : session.CreateSQLQuery("SELECT * FROM [dbo].[FNC_GETCUSTOMERS](:customers)").SetString("customers", customers);

                return
                    query.SetResultTransformer(Transformers.AliasToBean(typeof(CUSTOMEREXT))).List<CUSTOMEREXT>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override TMCUSTOMERS SaveOrUpdate(TMCUSTOMERS p)
        {
            try
            {
                var isnewrecord = p.CUS_SQLIDENTITY == 0;
                var pmlist = (p.CUS_PM != null && p.CUS_PM != "*") ? p.CUS_PM.Split(',') : Array.Empty<string>();
                if (pmlist.Length == 1) p.CUS_PMMASTER = pmlist[0];

                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.CUS_SQLIDENTITY == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'CUSTOMER' AND fm.FMP_FIELD = 'PM' AND fm.FMP_CODE = ?", p.CUS_CODE, NHibernateUtil.String);

                foreach (var pm in pmlist)
                {
                    session.Save(new TMFIELDMAPS
                    {
                        FMP_ENTITY = "CUSTOMER",
                        FMP_FIELD = "PM",
                        FMP_VALUE = pm,
                        FMP_CODE = p.CUS_CODE,
                        FMP_CREATED = DateTime.Now,
                        FMP_CREATEDBY = isnewrecord ? p.CUS_CREATEDBY : p.CUS_UPDATEDBY,
                        FMP_RECORDVERSION = 0
                    });
                }
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}