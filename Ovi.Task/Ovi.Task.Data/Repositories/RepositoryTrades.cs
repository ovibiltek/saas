using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;
using Ovi.Task.Data.Extensions;


namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTrades : BaseRepository<TMTRADES, string>
    {
        public override TMTRADES SaveOrUpdate(TMTRADES p)
        {
            try
            {
                var isnewrecord = p.TRD_SQLIDENTITY == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.TRD_SQLIDENTITY == 0);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'TRADE' AND fm.FMP_FIELD = 'REGION' AND fm.FMP_CODE = ?", p.TRD_CODE, NHibernateUtil.String);
                if (p.TRD_REGION != null && p.TRD_REGION != "*")
                    foreach (var trd in p.TRD_REGION.Split(','))
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "TRADE",
                            FMP_FIELD = "REGION",
                            FMP_VALUE = trd,
                            FMP_CODE = p.TRD_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.TRD_CREATEDBY : p.TRD_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'TRADE' AND fm.FMP_FIELD = 'TASKTYPE' AND fm.FMP_CODE = ?", p.TRD_CODE, NHibernateUtil.String);
                if (p.TRD_TASKTYPES != null && p.TRD_TASKTYPES != "*")
                    foreach (var trd in p.TRD_TASKTYPES.Split(','))
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "TRADE",
                            FMP_FIELD = "TASKTYPE",
                            FMP_VALUE = trd,
                            FMP_CODE = p.TRD_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.TRD_CREATEDBY : p.TRD_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}