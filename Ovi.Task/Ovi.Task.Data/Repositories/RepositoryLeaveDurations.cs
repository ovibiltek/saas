using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryLeaveDurations : BaseRepository<TMLEAVEDURATIONS, string>
    {
        public TMLEAVEDURATIONS GetLeaveDurationByType(string type)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var leaveduration = session.QueryOver<TMLEAVEDURATIONS>()
                    .Where(x => x.LDU_TYPE == type)
                    .And(x => x.LDU_TYPEENTITY == "DAYOFFREQUEST")
                    .FutureValue<TMLEAVEDURATIONS>().Value;
                session.Evict(leaveduration);
                return leaveduration;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}