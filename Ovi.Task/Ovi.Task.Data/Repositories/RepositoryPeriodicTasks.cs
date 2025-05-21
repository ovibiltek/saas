using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPeriodicTasks : BaseRepository<TMPERIODICTASKS, string>
    {
        public IList<TMPERIODICTASKSPREVIEW> ListPreview(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMPERIODICTASKSPREVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void Generate(GENERATEPERIODICTASKSPARAMS p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GENERATEPERIODICTASKS @PPERIODICTASK=:task, @PSTART=:start, @PEND=:end, @PGENERATE=:generate");
                query.SetTimeout(0);
                query.SetString("task", p.PeriodicTask);
                query.SetDateTime("start", p.StartDate);
                query.SetDateTime("end", p.EndDate);
                query.SetCharacter("generate", p.Generate);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}