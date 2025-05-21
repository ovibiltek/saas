using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using Ovi.Task.Data.Exceptions;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryPreSales : BaseRepository<TMPRESALES,int>
    {
        public IList<TMPRESALESVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMPRESALESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
