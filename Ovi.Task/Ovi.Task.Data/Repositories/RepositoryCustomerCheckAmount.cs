using NHibernate;
using NHibernate.Criterion;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomerCheckAmount:BaseRepository<TMCUSTOMERCHECKAMOUNT,int>
    {

        public bool Save(string customer, TMCUSTOMERCHECKAMOUNT[] checkamounts)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMCUSTOMERCHECKAMOUNT ca WHERE ca.CCA_CUSTOMER = ?", customer,NHibernateUtil.String);
                foreach (var t in checkamounts)
                    session.SaveOrUpdateAndEvict(t);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCUSTOMERCHECKAMOUNT> GetByCustomer(string[] customers)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMCUSTOMERCHECKAMOUNT>()
                    .Where(x => x.CCA_CUSTOMER.IsIn(customers)).List();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }


    }
}
