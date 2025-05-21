using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryDescriptions : BaseRepository<TMDESCRIPTIONS, TMDESCRIPTIONS>
    {
        public bool SaveList(TMDESCRIPTIONS[] p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in p)
                {
                    session.SaveOrUpdateAndEvict(r);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDESCRIPTIONS> List(string cls, string property, string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMDESCRIPTIONS>()
                    .Where(x => x.DES_CLASS == cls)
                    .And(x => x.DES_PROPERTY == property)
                    .And(x => x.DES_CODE == code)
                    .List<TMDESCRIPTIONS>();
                session.EvictAll<TMDESCRIPTIONS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void DeleteDescriptions(string cls, string property, string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_DELDESCRIPTIONS @pclass=:cls, @pproperty=:property, @pcode=:code");
                query.SetString("cls", cls);
                query.SetString("property", property);
                query.SetString("code", code);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}