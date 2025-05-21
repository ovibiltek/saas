using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryContractServicePrices : BaseRepository<TMCONTRACTSERVICEPRICES, int>
    {
        public class ReferenceParams
        {
            public string Customer { get; set; }
            public int ServiceCode { get; set; }
        }


        public List<ErrLine> Save(List<ContractServicePricesModel> lstofcontractserviceprices,TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofcontractserviceprices.Count; i++)
            {
                ContractServicePricesModel pp = lstofcontractserviceprices[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(pp.ContractServicePrice);
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
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofcontractserviceprices.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }

        public string GetReference(ReferenceParams param)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.GetContractServiceCodeReference(:customer,:serviceCode)");
                query.SetString("customer", param.Customer);
                query.SetInt32("serviceCode", param.ServiceCode);
                return query.UniqueResult<string>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}