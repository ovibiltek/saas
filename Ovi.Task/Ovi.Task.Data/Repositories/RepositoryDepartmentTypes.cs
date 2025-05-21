using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryDepartmentTypes : BaseRepository<TMDEPARTMENTTYPES, long>
    {
        public bool Save(string depcode, TMDEPARTMENTTYPES[] types)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMDEPARTMENTTYPES p WHERE p.DPT_DEPCODE = ?", depcode, NHibernateUtil.String);
                foreach (var t in types)
                {
                    session.SaveOrUpdateAndEvict(t);
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