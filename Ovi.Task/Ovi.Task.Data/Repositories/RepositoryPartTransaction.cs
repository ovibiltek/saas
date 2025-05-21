using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Data;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPartTransaction : BaseRepository<TMPARTTRANS, long>
    {
        public List<ErrLine> Save(List<IssueReturnModel> lstofissuereturnparts, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            RepositoryPartTransactionLine repositoryPartTransactionLine = new RepositoryPartTransactionLine();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofissuereturnparts.Count; i++)
            {
                IssueReturnModel tkl = lstofissuereturnparts[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(tkl.Transaction);
      
                    foreach (var line in tkl.TransactionLines)
                    {
                        line.PTL_TRANSACTION = tkl.Transaction.PTR_ID;
                        repositoryPartTransactionLine.SaveOrUpdate(line);
                    }

                    tkl.Transaction.PTR_STATUS = "APP";
                    tkl.Transaction.PTR_UPDATED = tkl.Transaction.PTR_CREATED;
                    tkl.Transaction.PTR_UPDATEDBY = tkl.Transaction.PTR_CREATEDBY;
                    session.SaveOrUpdateAndEvict(tkl.Transaction);


                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = tkl.Values,
                        ErrMsg = ExceptionHandler.Process(exc).Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofissuereturnparts.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }

            return errorList;
        }
    }
}