using System;
using System.Collections.Generic;
using System.Data;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Quotation;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryQuotationPart : BaseRepository<TMQUOTATIONPART, long>
    {
        public List<ErrLine> Save(List<QuotationPartModel> lstofquoparts, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofquoparts.Count; i++)
            {
                QuotationPartModel quopar = lstofquoparts[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(quopar.Part);
                    NHibernateSessionManager.Instance.CommitTransaction();

                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = quopar.Values,
                        ErrMsg = ExceptionHandler.Process(exc).Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofquoparts.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }
    }
}