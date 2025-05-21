using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryWarehouseTransferLines : BaseRepository<TMWAREHOUSETRANSFERLINES, long>
    {
        
        public IList<TMWAREHOUSETRANSFERLINES> GetLinesByTransferID(long id)
        {
            try
            { 
                var session = NHibernateSessionManager.Instance.GetSession();
                var list = session.QueryOver<TMWAREHOUSETRANSFERLINES>()
                    .Where(x => x.WTL_WTRID == id)
                    .List<TMWAREHOUSETRANSFERLINES>();
                session.EvictAll<TMWAREHOUSETRANSFERLINES>();
                return list;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
           
        }
    }
}