using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryContractEquipManPrices : BaseRepository<TMCONTRACTEQUIPMANPRICES, int>
    {

        public List<ErrLine> Save(List<ContractEquipManPricesModel> lstofequipmanprices,TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofequipmanprices.Count; i++)
            {
                ContractEquipManPricesModel pp = lstofequipmanprices[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(pp.EquipManPrice);
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
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofequipmanprices.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }
    }
}
