using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;


namespace Ovi.Task.Data.Repositories
{
    public class RepositoryEntrustParts:BaseRepository<TMENTRUSTPARTS,int>
    {
        public TMENTRUSTPARTS GetByEntrust(int entrust)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMENTRUSTPARTS>()
                    .Where(x => x.ENP_ENTRUSTID == entrust)
                    .FutureValue<TMENTRUSTPARTS>().Value;
                session.EvictAll<TMENTRUSTPARTS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
