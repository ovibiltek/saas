using Newtonsoft.Json.Linq;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCurrencies : BaseRepository<TMCURRENCIES, string>
    {
        public IList<TMCURRENCIES> ListByOrganization(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var currencies = new JArray(session.QueryOver<TMORGS>().List().Select(x => new[] { x.ORG_CURRENCY }));
                session.EvictAll<TMORGS>();
                krg.filter.Filters.Add(new GridFilter
                {
                    Field = "CUR_CODE",
                    Operator = "in",
                    Value = currencies
                });
                return CriteriaHelper<TMCURRENCIES>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}