
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;


namespace Ovi.Task.Data.Repositories
{
    public class RepositoryMenuConfiguration : BaseRepository<TMMENUCONFIGURATION, int>
    {

        public TMMENUCONFIGURATION GetByLang(string lang)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMMENUCONFIGURATION>()
                        .Where(x => x.MNU_LANG == lang).FutureValue().Value;
                       
                session.EvictAll<TMMENUCONFIGURATION>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

    }
}