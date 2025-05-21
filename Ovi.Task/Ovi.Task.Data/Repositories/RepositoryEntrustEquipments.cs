using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryEntrustEquipments:BaseRepository<TMENTRUSTEQUIPMENTS,int>
    {
        public TMENTRUSTEQUIPMENTS GetByEntrust(int entrust)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMENTRUSTEQUIPMENTS>()
                    .Where(x => x.EEQ_ENTRUSTID == entrust)
                    .FutureValue<TMENTRUSTEQUIPMENTS>().Value;
                session.EvictAll<TMENTRUSTEQUIPMENTS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
