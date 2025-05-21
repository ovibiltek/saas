using System;
using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomerEquipmentConfig : BaseRepository<TMCUSTOMEREQUIPMENTCONFIG, long>
    {
        public override TMCUSTOMEREQUIPMENTCONFIG SaveOrUpdate(TMCUSTOMEREQUIPMENTCONFIG p)
        {
            try
            {
                var isnewrecord = p.CEC_ID == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.CEC_ID == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'CUSTOMEREQPCONFIG' AND fm.FMP_FIELD = 'TASKTYPE' AND fm.FMP_CODE = ?", p.CEC_TSKTYPE, NHibernateUtil.String);

                if (p.CEC_TSKTYPE != null && p.CEC_TSKTYPE != "*")
                {
                    foreach (var r in p.CEC_TSKTYPE.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "CUSTOMEREQPCONFIG",
                            FMP_FIELD = "TASKTYPE",
                            FMP_VALUE = r,
                            FMP_CODE = p.CEC_ID.ToString(),
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = (isnewrecord ? p.CEC_CREATEDBY : p.CEC_UPDATEDBY),
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