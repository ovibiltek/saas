using System;
using System.Collections.Generic;
using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Supervision;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySupervision : BaseRepository<TMSUPERVISION, long>
    {
        public override TMSUPERVISION SaveOrUpdate(TMSUPERVISION p)
        {
            try
            {
                var isnewrecord = p.SPV_ID == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.SPV_ID == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'SUPERVISION' AND fm.FMP_FIELD = 'SUPERVISOR' AND fm.FMP_CODE = ?", p.SPV_ID.ToString(), NHibernateUtil.String);
                if (p.SPV_SUPERVISOR != null && p.SPV_SUPERVISOR != "*")
                    foreach (var aud in p.SPV_SUPERVISOR.Split(','))
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "SUPERVISION",
                            FMP_FIELD = "SUPERVISOR",
                            FMP_VALUE = aud,
                            FMP_CODE = p.SPV_ID.ToString(),
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.SPV_CREATEDBY : p.SPV_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSUPERVISIONVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMSUPERVISIONVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
