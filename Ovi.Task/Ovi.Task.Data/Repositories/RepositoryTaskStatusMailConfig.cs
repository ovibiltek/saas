using System;
using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskStatusMailConfig : BaseRepository<TMTSKSTATUSMAILCONFIG, long>
    {
        public override TMTSKSTATUSMAILCONFIG SaveOrUpdate(TMTSKSTATUSMAILCONFIG p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p);

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'TSKSTSMAILCONFIG' AND fm.FMP_FIELD = 'TSKINCCATEGORY' AND fm.FMP_CODE = ?", p.TSM_ID, NHibernateUtil.String);
                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'TSKSTSMAILCONFIG' AND fm.FMP_FIELD = 'TSKEXCCATEGORY' AND fm.FMP_CODE = ?", p.TSM_ID, NHibernateUtil.String);
                if (p.TSM_INCCATEGORIES != null)
                {
                    foreach (var category in p.TSM_INCCATEGORIES.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "TSKSTSMAILCONFIG",
                            FMP_FIELD = "TSKINCCATEGORY",
                            FMP_VALUE = category,
                            FMP_CODE = p.TSM_ID.ToString(),
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = p.TSM_CREATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                    }
                }
                if (p.TSM_EXCCATEGORIES != null)
                {
                    foreach (var category in p.TSM_EXCCATEGORIES.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "TSKSTSMAILCONFIG",
                            FMP_FIELD = "TSKEXCCATEGORY",
                            FMP_VALUE = category,
                            FMP_CODE = p.TSM_ID.ToString(),
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = p.TSM_CREATEDBY,
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