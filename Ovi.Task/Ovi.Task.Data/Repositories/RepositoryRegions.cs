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

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryRegions : BaseRepository<TMREGIONS, string>
    {
        public IList<TMREGIONEXT> GetRegions(string regions)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMREGIONEXT>();
                IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETREGIONS]('{0}')", regions));
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMREGIONEXT))).List<TMREGIONEXT>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override TMREGIONS SaveOrUpdate(TMREGIONS p)
        {
            try
            {
                var isnewrecord = p.REG_SQLIDENTITY == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.REG_SQLIDENTITY == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'REGION' AND fm.FMP_FIELD = 'RESPONSIBLE' AND fm.FMP_CODE = ?", p.REG_CODE, NHibernateUtil.String);
                if (p.REG_RESPONSIBLE != null && p.REG_RESPONSIBLE != "*")
                {
                    foreach (var r in p.REG_RESPONSIBLE.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "REGION",
                            FMP_FIELD = "RESPONSIBLE",
                            FMP_VALUE = r,
                            FMP_CODE = p.REG_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = (isnewrecord ? p.REG_CREATEDBY : p.REG_UPDATEDBY),
                            FMP_RECORDVERSION = 0
                        });
                    }
                }

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'REGION' AND fm.FMP_FIELD = 'REPORTINGRESPONSIBLE' AND fm.FMP_CODE = ?", p.REG_CODE, NHibernateUtil.String);
                if (p.REG_REPORTINGRESPONSIBLE != null && p.REG_REPORTINGRESPONSIBLE != "*")
                {
                    foreach (var r in p.REG_REPORTINGRESPONSIBLE.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "REGION",
                            FMP_FIELD = "REPORTINGRESPONSIBLE",
                            FMP_VALUE = r,
                            FMP_CODE = p.REG_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = (isnewrecord ? p.REG_CREATEDBY : p.REG_UPDATEDBY),
                            FMP_RECORDVERSION = 0
                        });
                    }
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