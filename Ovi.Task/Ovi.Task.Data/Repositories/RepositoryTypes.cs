using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTypes : BaseRepository<TMTYPES, TMTYPES>
    {
        public IList<TMDEPARTMENTTYPESVIEW> ListByDepartment(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMDEPARTMENTTYPESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMTYPES GetByEntityAndOrganization(string entity, string organization)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTYPES>()
                        .Where(x => x.TYP_ENTITY == entity)
                        .And(x => x.TYP_ORGANIZATION == organization)
                        .FutureValue<TMTYPES>()
                        .Value;
                session.EvictAll<TMTYPES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override bool DeleteByEntity(TMTYPES t)
        {
            try
            {
                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMTYPES", "TYP_DESC", string.Format("{0}#{1}", t.TYP_ENTITY, t.TYP_CODE));
                return base.DeleteByEntity(t);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}