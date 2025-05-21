using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using Ovi.Task.Data.Data_Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySecurityFilter : BaseRepository<TMSECURITYFILTERS, string>
    {
        public bool ValidateSecurityFilter(string securityfiltercode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMSECURITYFILTERS>();

                var securityfilter = session.GetAndEvict<TMSECURITYFILTERS>(securityfiltercode);
                var screen = session.GetAndEvict<TMSCREENS>(securityfilter.SCF_SCREEN);

                securityfilter.SCF_CONDITION = SqlQueryHelper.SecureSql(securityfilter.SCF_CONDITION);
                session.CreateSQLQuery(string.Format("SELECT COUNT(*) FROM {0} WHERE 1=1 AND {1}", screen.SCR_CLASS,
                    securityfilter.SCF_CONDITION.Replace(":USER", "TEST")
                        .Replace(":USERDEPARTMENT", "TEST")
                        .Replace(":YEAR", "-1")
                        .Replace(":MONTH", "-1")
                        .Replace(":USERGROUP", "TEST")));

                securityfilter.SCF_ISVALIDATED = '+';
                session.SaveOrUpdateAndEvict(securityfilter);

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}