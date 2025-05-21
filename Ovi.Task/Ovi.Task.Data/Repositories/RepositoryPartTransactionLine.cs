using System;
using System.Collections.Generic;
using System.Data;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPartTransactionLine : BaseRepository<TMPARTTRANLINES, long>
    {
        public List<ErrLine> Save(List<InventoryReceiptModel> lstofissuereturnparts, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofissuereturnparts.Count; i++)
            {
                InventoryReceiptModel tkl = lstofissuereturnparts[i];
                try
                {
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    var ptl = new TMPARTTRANLINES
                    {
                        PTL_TRANSACTION = tkl.IssueReturn.Transaction,
                        PTL_PART = tkl.IssueReturn.Part,
                        PTL_BIN = tkl.IssueReturn.Bin,
                        PTL_QTY = tkl.IssueReturn.Quantity,
                        PTL_PRICE = tkl.IssueReturn.Price,
                        PTL_CREATED = DateTime.Now,
                        PTL_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code,
                        PTL_TRANSACTIONDATE = DateTime.Now,
                        PTL_TYPE = tkl.IssueReturn.Type,
                        PTL_WAREHOUSE = tkl.IssueReturn.Warehouse
                    };
                    NHibernateSessionManager.Instance.GetSession().SaveOrUpdateAndEvict(ptl);
                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = tkl.Values,
                        ErrMsg = exc.Message,
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