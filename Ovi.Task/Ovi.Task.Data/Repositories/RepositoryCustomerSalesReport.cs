using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class CustomerSalesReportParameters
    {
        public string Organization { get; set; }

        public string Department { get; set; }

        public string OnlyPSP { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }
    }

    public class RepositoryCustomerSalesReport
    {
        public IList<TMCUSTOMERSALES> List(CustomerSalesReportParameters customerSalesReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_CUSTOMERBASEDSALES @PORGANIZATION=:organization,@PDEPARTMENT=:department, @PCOMPLETEDSTART=:completedstart, @PCOMPLETEDEND=:completedend, @PPSPONLY=:onlypsp");
                query.SetString("organization", customerSalesReportParameters.Organization);
                query.SetString("department", customerSalesReportParameters.Department);
                query.SetString("onlypsp", customerSalesReportParameters.OnlyPSP);
                query.SetDateTime("completedstart", customerSalesReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerSalesReportParameters.TaskCompletedEnd);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCUSTOMERSALES))).List<TMCUSTOMERSALES>();
                session.EvictAll<TMCUSTOMERSALES>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}