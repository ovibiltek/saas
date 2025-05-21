using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;
using System.Collections.Generic;
using System.Data;


namespace Ovi.Task.Data.Repositories
{
    public class RepositoryUserQualifications : BaseRepository<TMUSERQUALIFICATIONS, int>
    {
        public List<ErrLine> BulkSave(List<UploadData<TMUSERQUALIFICATIONS>> lstUserQulifications)
        {
            var errorList = new List<ErrLine>();
            foreach (var uq in lstUserQulifications)
            {
                using (var trx = NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted))
                {
                    try
                    {
                        SaveOrUpdate(uq.Data);
                        NHibernateSessionManager.Instance.CommitTransaction();
                    }
                    catch (Exception exc)
                    {
                        NHibernateSessionManager.Instance.RollbackTransaction();
                        var excSave = ExceptionHandler.Process(exc);
                        errorList.Add(new ErrLine
                        {
                            Values = uq.Values,
                            ErrMsg = excSave.Message,
                            LineType = "LINE"
                        });
                    }
                }
            }
            return errorList;
        }
    }
}
