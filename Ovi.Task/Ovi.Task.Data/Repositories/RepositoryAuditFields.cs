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
    public class RepositoryAuditFields : BaseRepository<TMAUDITFIELDS, long>
    {
        public IList<TMAUDITFIELDS> ListByClass(string cls)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMAUDITFIELDS>()
                        .Where(x => x.AUF_CLASS == cls)
                        .And(x => x.AUF_ACTIVE == '+')
                        .List();
                session.EvictAll<TMAUDITFIELDS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveList(TMAUDITFIELDS[] p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in p)
                {
                    session.SaveOrUpdateAndEvict(r);
                }

                if (p.Length > 0)
                {
                    IQuery query = session.CreateSQLQuery("EXEC TM_CREATEAUDITTRG @pTable=:table");
                    query.SetString("table", p[0].AUF_CLASS);
                    query.ExecuteUpdate();
                }
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}