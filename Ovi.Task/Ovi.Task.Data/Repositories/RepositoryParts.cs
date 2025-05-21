using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;
using System.Collections.Generic;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System.Data;

namespace Ovi.Task.Data.Repositories
{


    public class RepositoryParts : BaseRepository<TMPARTS, long>
    {
        public class PartPriceParams
        {
            public PartPriceParams(int task, int part, string curr)
            {
                Task = task;
                Part = part;
                Curr = curr;
            }

            public int Task { get; private set; }
            public int Part { get; private set; }
            public string Curr { get; private set; }
        }

        public TMPARTS GetByCode(string partcode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMPARTS>()
                    .Where(x => x.PAR_CODE == partcode)
                    .FutureValue<TMPARTS>().Value;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public decimal? GetPartPrice(PartPriceParams partPriceParams)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.TM_CALCPARTPRICE_PLN(:task, :part, :curr)");
                query.SetInt32("task", partPriceParams.Task);
                query.SetInt32("part", partPriceParams.Part);
                query.SetString("curr", partPriceParams.Curr);
                return query.UniqueResult<decimal?>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool UpdateTaskActivityPartPrice(long tsaid, string part, decimal unitsaleprice)
        {

            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_UPDATETASKACTIVITYPARTPRICE @pActivity=:activity, @pPartCode=:part, @pUnitSalesPrice=:saleprice");
                query.SetInt64("activity", tsaid);
                query.SetString("part", part);
                query.SetDecimal("saleprice", unitsaleprice);

                query.ExecuteUpdate();
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<ErrLine> Save(List<PartModel> lstofparts, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofparts.Count; i++)
            {
                PartModel pp = lstofparts[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(pp.Part);
                    NHibernateSessionManager.Instance.CommitTransaction();

                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = pp.Values,
                        ErrMsg = ExceptionHandler.Process(exc).Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofparts.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }
    }
}