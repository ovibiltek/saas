using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class LeaveDurationParameters
    {
        public string User { get; set; }

        public DateTime Start { get; set; }

        public DateTime End { get; set; }
    }

    public class RepositoryDayOffRequests : BaseRepository<TMDAYOFFREQUESTS, long>
    {
        public decimal CalculateLeaveDuration(LeaveDurationParameters leaveDurationParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.TM_CALCULATELEAVEDURATION(:user,:start,:end)");
                query.SetString("user", leaveDurationParameters.User);
                query.SetDateTime("start", leaveDurationParameters.Start);
                query.SetDateTime("end", leaveDurationParameters.End);
                return query.UniqueResult<decimal>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}