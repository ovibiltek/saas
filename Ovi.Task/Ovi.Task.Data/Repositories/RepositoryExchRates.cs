using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryExchRates : BaseRepository<TMEXCHRATES, long>
    {
        public TMEXCHRATES QueryExchRate(TMEXCHRATES p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_EXCHRATE "
                                                        + "@pFromCurr=:fromCurr, "
                                                        + "@pToCurr=:toCurr,"
                                                        + "@pDate=:date");
                query.SetString("fromCurr", p.CRR_CURR);
                query.SetString("toCurr", p.CRR_BASECURR);
                query.SetDateTime("date", p.CRR_STARTDATE);
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMEXCHRATES))).UniqueResult<TMEXCHRATES>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMEXCHRATES GetLatestExchRate(TMEXCHRATES p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GET_LATEST_EXCHRATE "
                                                      + "@pFromCurr=:fromCurr, "
                                                      + "@pToCurr=:toCurr");
                query.SetString("fromCurr", p.CRR_CURR);
                query.SetString("toCurr", p.CRR_BASECURR);
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMEXCHRATES))).UniqueResult<TMEXCHRATES>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}