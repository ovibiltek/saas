using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using System.Collections.Generic;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPurchaseOrderRequisitionLines : BaseRepository<TMPURCHASEORDERREQUISITIONLINES, long>
    {
        public IList<TMPURCHASEORDERREQUISITIONLINES> GetLines()
        {
            var session = NHibernateSessionManager.Instance.GetSession();
            var l = session.QueryOver<TMPURCHASEORDERREQUISITIONLINES>().List();
            session.EvictAll<TMPURCHASEORDERREQUISITIONLINES>();
            return l;
        }

        public IList<TMPURCHASEREQUESTPOVIEW> GetLinesWithOrder(GridRequest krg)
        {
            var session = NHibernateSessionManager.Instance.GetSession();
            return CriteriaHelper<TMPURCHASEREQUESTPOVIEW>.Run(session, krg);

        }
    }
}