using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryContractPartPrices : BaseRepository<TMCONTRACTPARTPRICES, int>
    {
        public class ReferenceParams
        {
            public string Customer { get; set; }
            public int Part { get; set; }
        }

        public List<ErrLine> Save(List<ContractPartPricesModel> lstofpartprices, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofpartprices.Count; i++)
            {
                ContractPartPricesModel pp = lstofpartprices[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(pp.PartPrice);
                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = pp.Values,
                        ErrMsg = exc.InnerException.Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofpartprices.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }

        public IList<TMCONTRACTPARTPRICES> GetContractPartPrices(GetContractPartPricesParam getContractPartPricesParam)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETCONTRACTPARTPRICES @pTask=:task, @pPart=:part");
                query.SetInt32("task", getContractPartPricesParam.Task);
                query.SetInt32("part", getContractPartPricesParam.Part);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCONTRACTPARTPRICES))).List<TMCONTRACTPARTPRICES>();
                session.EvictAll<TMCONTRACTPARTPRICES>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public string GetReference(ReferenceParams param)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.GetPartContractReference(:customer,:part)");
                query.SetString("customer", param.Customer);
                query.SetInt32("part", param.Part);
                return query.UniqueResult<string>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

    }
}