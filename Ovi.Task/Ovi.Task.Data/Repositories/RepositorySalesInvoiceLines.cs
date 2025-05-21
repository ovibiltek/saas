using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.ProgressPayment;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySalesInvoiceLines : BaseRepository<TMSALESINVOICELINES, int>
    {
        public bool SaveList(TMSALESINVOICELINES[] mSalesInvoiceLines)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in mSalesInvoiceLines)
                {
                    session.SaveOrUpdateAndEvict(r);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}