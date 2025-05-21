using NHibernate;
using NHibernate.Transform;
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
    public class TodoQuery
    {
        public string Department { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        public string User { get; set; }
    }

    public class RepositoryToDoList : BaseRepository<TMTODOLIST, long>
    {
        public IList<TMTODOLISTCOUNTVIEW> ListCount(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTODOLISTCOUNTVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMTODOLISTEXT> Query(TodoQuery toque)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_LISTTODOS @puser=:user, @pdepartment=:department, @pstart=:start, @pend= :end ");
                query.SetString("department", toque.Department);
                query.SetString("user", toque.User);
                query.SetDateTime("start", toque.Start);
                query.SetDateTime("end", toque.End);
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMTODOLISTEXT))).List<TMTODOLISTEXT>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}