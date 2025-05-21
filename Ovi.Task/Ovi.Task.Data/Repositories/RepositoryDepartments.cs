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
    public class RepositoryDepartments : BaseRepository<TMDEPARTMENTS, string>
    {
        public IList<TMDEPARTMENTS> ListByLM(string lmusercode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_LISTDEPARTMENTSBYLM @puser=:user");
                query.SetString("user", lmusercode);
                var departments = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMDEPARTMENTS))).List<TMDEPARTMENTS>();
                session.EvictAll<TMDEPARTMENTS>();
                return departments;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDEPARTMENTEXT> GetDepartments(string user, char obo)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_LISTDEPARTMENTSBYUSER @PUSER=:user, @POBO=:obo");
                query.SetString("user", user);
                query.SetCharacter("obo", obo);
                var departments = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMDEPARTMENTEXT))).List<TMDEPARTMENTEXT>();
                session.EvictAll<TMDEPARTMENTEXT>();
                return departments;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override TMDEPARTMENTS SaveOrUpdate(TMDEPARTMENTS p)
        {
            try
            {
                var isnewrecord = p.DEP_SQLIDENTITY == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, isnewrecord);
                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'DEPARTMENT' AND fm.FMP_FIELD = 'AUTHORIZEDUSER' AND fm.FMP_CODE = ?", p.DEP_CODE, NHibernateUtil.String);
                if (p.DEP_AUTHORIZED != null)
                {
                    foreach (var aud in p.DEP_AUTHORIZED.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "DEPARTMENT",
                            FMP_FIELD = "AUTHORIZEDUSER",
                            FMP_VALUE = aud,
                            FMP_CODE = p.DEP_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = (isnewrecord ? p.DEP_CREATEDBY : p.DEP_UPDATEDBY),
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