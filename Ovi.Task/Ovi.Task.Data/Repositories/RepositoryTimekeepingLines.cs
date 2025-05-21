using NHibernate;
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
    public class RepositoryTimekeepingLines : BaseRepository<TMTIMEKEEPINGLINES, long>
    {
        public IList<TMTIMEKEEPINGLINESVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMTIMEKEEPINGLINESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool Save(TMTIMEKEEPINGLINES[] lstoftimekeepinglines)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var tkl in lstoftimekeepinglines)
                {
                    session.SaveOrUpdateAndEvict(tkl);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool UpdateLine(long tkdid)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_UPDATE_TIMEKEEPINGLINE @PTIMEKEEPING=:lineid");
                query.SetInt64("lineid", tkdid);
                query.ExecuteUpdate();

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}