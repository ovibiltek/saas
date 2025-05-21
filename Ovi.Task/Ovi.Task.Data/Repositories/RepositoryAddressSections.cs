using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryAddressSections : BaseRepository<TMADDRESSSECTIONS, long>
    {
        public TMADDRESSSECTIONS Get(TMADDRESSSECTIONS addresssection)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMADDRESSSECTIONS>().Where(x => x.ADS_CODE == addresssection.ADS_CODE)
                    .And(x => x.ADS_TYPE == addresssection.ADS_TYPE).FutureValue<TMADDRESSSECTIONS>().Value;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}