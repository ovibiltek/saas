using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using Ovi.Task.Data.Extensions;
using Castle.Core.Resource;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySuppliers : BaseRepository<TMSUPPLIERS, string>
    {
        public IList<SUPPLIEREXT> GetSuppliers(string suppliers, bool showall)
        {
            try
            {
                if (string.IsNullOrEmpty(suppliers))
                    return null;

                var session = NHibernateSessionManager.Instance.GetSession();
                var query = (suppliers.Contains("*") && showall)
                    ? session.CreateSQLQuery("SELECT SUP_CODE,SUP_DESC FROM TMSUPPLIERS WHERE SUP_CODE <> '*'")
                    : session.CreateSQLQuery("SELECT * FROM [dbo].[FNC_GETSUPPLIERS](:suppliers)").SetString("suppliers", suppliers);
                return
                    query.SetResultTransformer(Transformers.AliasToBean(typeof(SUPPLIEREXT))).List<SUPPLIEREXT>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSUPPLIERTASKTYPESVIEW> ListSupplierTaskTypes(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSUPPLIERTASKTYPESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override TMSUPPLIERS SaveOrUpdate(TMSUPPLIERS p)
        {
            try
            {
                var isnewrecord = p.SUP_SQLIDENTITY == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.SUP_SQLIDENTITY == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'SUPPLIER' AND fm.FMP_FIELD = 'REGION' AND fm.FMP_CODE = ?", p.SUP_CODE, NHibernateUtil.String);
                if (p.SUP_REGION != null && p.SUP_REGION != "*")
                    foreach (var aud in p.SUP_REGION.Split(','))
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "SUPPLIER",
                            FMP_FIELD = "REGION",
                            FMP_VALUE = aud,
                            FMP_CODE = p.SUP_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.SUP_CREATEDBY : p.SUP_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'SUPPLIER' AND fm.FMP_FIELD = 'TASKTYPE' AND fm.FMP_CODE = ?", p.SUP_CODE, NHibernateUtil.String);
                if (p.SUP_TASKTYPES != null && p.SUP_TASKTYPES != "*")
                    foreach (var sup in p.SUP_TASKTYPES.Split(','))
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "SUPPLIER",
                            FMP_FIELD = "TASKTYPE",
                            FMP_VALUE = sup,
                            FMP_CODE = p.SUP_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.SUP_CREATEDBY : p.SUP_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public string GetAdrByTSA(int task, int line)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.GetSupplierAdrByTSA(:task,:line)");
                query.SetInt32("task", task);
                query.SetInt32("line", line);
                return query.UniqueResult<string>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}