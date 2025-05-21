using System;
using System.Collections.Generic;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Project;
using Ovi.Task.Data.Entity.Task;
using Ovi.Task.Data.Exceptions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryProjectPricing : BaseRepository<TMPROJECTPRICING, long>
    {
        public IList<TMPROJECTPRICING> ListByProject(long projectid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMPROJECTPRICING>()
                    .Where(x => x.PPR_PROJECT == projectid)
                    .OrderBy(x => x.PPR_TYPE).Desc
                    .ThenBy(x => x.PPR_SUBTYPE).Asc
                    .ThenBy(x => x.PPR_TYPEDESC).Asc
                    .List<TMPROJECTPRICING>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTASKPRICINGSUMMARY> ListTaskPricingSummary(long projectid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMTASKPRICINGSUMMARY>()
                    .Where(x => x.PPR_PROJECT == projectid)
                    .OrderBy(x => x.PPR_TASK).Desc
                    .List<TMTASKPRICINGSUMMARY>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

    }
}