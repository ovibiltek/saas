using System;
using System.Collections.Generic;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryTaskCounts
    {
       
        public IList<TMTSKCNTS> GetListByUser(string usercode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMTSKCNTS>().Where(x => x.TSK_ASSIGNEDTO == usercode).List();
                session.EvictAll<TMTSKCNTS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
