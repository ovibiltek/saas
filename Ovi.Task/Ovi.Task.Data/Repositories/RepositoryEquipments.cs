using System;
using System.Collections.Generic;
using System.Data;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryEquipments : BaseRepository<TMEQUIPMENTS, long>
    {
        public TMEQUIPMENTS GetByCode(string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMEQUIPMENTS>()
                    .Where(x => x.EQP_CODE == code)
                    .FutureValue<TMEQUIPMENTS>().Value;
                session.EvictAll<TMEQUIPMENTS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKEQUIPMENTLISTVIEW> GetTaskEquipmentList(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTASKEQUIPMENTLISTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<EquipmentCalendarCounts> GetCalendarCounts(EquipmentCalendarCountParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETEQUIPMENTCALENDARCOUNT @pCustomer=:customer, @pBranch=:branch, @pEquipmentType=:equipmenttype, @pEquipmentId=:equipmentid, @pYear=:year");
                query.SetString("customer", p.Customer);
                query.SetString("branch", p.Branch);
                query.SetString("equipmenttype", p.EquipmentType);
                query.SetInt32("equipmentid", p.Equipment);
                query.SetInt32("year", p.Year);

                var lstcnt = query.SetResultTransformer(Transformers.AliasToBean(typeof(EquipmentCalendarCounts))).List<EquipmentCalendarCounts>();
                session.EvictAll<EquipmentCalendarCounts>();
                return lstcnt;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<ErrLine> Save(List<EquipmentModel> lstOfEquipments)
        {
            var errorList = new List<ErrLine>();
            foreach (var eqp in lstOfEquipments)
            {
                using (var trx = NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted))
                {
                    try
                    {
                        SaveOrUpdate(eqp.Equipment);
                        if (eqp.CustomFieldValues != null)
                        {
                            var repositoryCustomFieldValues = new RepositoryCustomFieldValues();
                            repositoryCustomFieldValues.Save("EQUIPMENT", eqp.Equipment.EQP_ID.ToString(), eqp.CustomFieldValues);
                        }
                        NHibernateSessionManager.Instance.CommitTransaction();
                    }
                    catch (Exception exc)
                    {
                        NHibernateSessionManager.Instance.RollbackTransaction();
                        var excSave = ExceptionHandler.Process(exc);
                        errorList.Add(new ErrLine
                        {
                            Values = eqp.Values,
                            ErrMsg = excSave.Message,
                            LineType = "LINE"
                        });
                    }
                }
            }
            return errorList;

        }
    }
}