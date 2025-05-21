using System;
using System.Collections.Generic;
using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryLookupLines : BaseRepository<TMLOOKUPLINES, long>
    {
        public bool DeleteByCode(string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMLOOKUPLINES l WHERE l.TML_CODE = ?", code, NHibernateUtil.String);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMLOOKUPLINES> ListByCodes(string[] codes, string type)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMLOOKUPLINES>()
                    .WhereRestrictionOn(x => x.TML_CODE)
                    .IsIn(codes)
                    .And(x => x.TML_TYPE == type)
                    .List();
                session.EvictAll<TMLOOKUPLINES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMLOOKUPLINES GetLine(string type, string code, string itemcode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMLOOKUPLINES>()
                    .Where(x => x.TML_ITEMCODE == itemcode)
                    .And(x => x.TML_CODE == code)
                    .And(x => x.TML_TYPE == type)
                    .FutureValue<TMLOOKUPLINES>().Value;
                session.EvictAll<TMLOOKUPLINES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}