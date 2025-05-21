using System;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Project;
using Ovi.Task.Data.Exceptions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryProjectOfferRevisions : BaseRepository<TMPROJECTOFFERREVISIONS, long>
    {
        public TMPROJECTOFFERREVISIONS GetLastOffer(long projectId)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lastoffer = session.QueryOver<TMPROJECTOFFERREVISIONS>()
                    .Where(x => x.PRV_PROJECT == projectId)
                    .OrderBy(x => x.PRV_REVNO).Desc
                    .Take(1)
                    .FutureValue<TMPROJECTOFFERREVISIONS>().Value;
                return lastoffer;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public int GetCount(long projectId)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var count = session.QueryOver<TMPROJECTOFFERREVISIONS>()
                    .Where(x => x.PRV_PROJECT == projectId)
                    .RowCount();
                return count;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}