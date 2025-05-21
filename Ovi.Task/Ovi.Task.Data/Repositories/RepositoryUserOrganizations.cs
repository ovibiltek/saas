using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryUserOrganizations : BaseRepository<TMUSERORGANIZATIONS, long>
    {
        public string[] ListByUser(string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var userorglist = from p in session.QueryOver<TMUSERORGANIZATIONS>()
                                  where p.UOG_USER == code
                                  select p.UOG_ORG;

                session.EvictAll<TMUSERORGANIZATIONS>();
                return (userorglist.List<string>() as List<string>).ToArray();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}