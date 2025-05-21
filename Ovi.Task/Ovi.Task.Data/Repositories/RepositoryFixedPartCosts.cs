using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryFixedPartCosts : BaseRepository<TMFIXEDPARTCOSTS, int>
    {
        public List<ErrLine> Save(List<FixedPartCostsModel> lstoffixedpartcosts)
        {
            var errorList = new List<ErrLine>();
            foreach (var pp in lstoffixedpartcosts)
            {
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    session.SaveOrUpdateAndEvict(pp.FixedPartCosts, pp.FixedPartCosts.FPC_ID == 0);
                    session.Evict(pp.FixedPartCosts);
                    NHibernateSessionManager.Instance.CommitTransaction();

                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = pp.Values,
                        ErrMsg = exc.Message,
                        LineType = "LINE"
                    });
                }
            }
            return errorList;
        }
    }
}
