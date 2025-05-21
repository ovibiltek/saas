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
    public class PerformanceReportParameters
    {
        public string Customer { get; set; }

        public string CustomerGroup { get; set; }

        public string Type { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }
    }

    public class RepositoryCustomerPerformanceReport
    {
        public IList<TMCUSTOMERPERFORMANCE> List(PerformanceReportParameters performanceReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_CUSTOMERPERFORMANCEREPORT @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTYPE=:type, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend");
                query.SetString("customer", performanceReportParameters.Customer);
                query.SetString("customergroup", performanceReportParameters.CustomerGroup);
                query.SetString("type", performanceReportParameters.Type);
                query.SetDateTime("completedstart", performanceReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", performanceReportParameters.TaskCompletedEnd);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCUSTOMERPERFORMANCE))).List<TMCUSTOMERPERFORMANCE>();
                session.EvictAll<TMCUSTOMERPERFORMANCE>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMCUSTOMERPERFORMANCE GetSum(PerformanceReportParameters performanceReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_CUSTOMERPERFORMANCEREPORT_SUMAVG @PCUSTOMER=:customer, @PCUSTOMERGROUP=:customergroup, @PTYPE=:type, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend");
                query.SetString("customer", performanceReportParameters.Customer);
                query.SetString("customergroup", performanceReportParameters.CustomerGroup);
                query.SetString("type", performanceReportParameters.Type);
                query.SetDateTime("completedstart", performanceReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", performanceReportParameters.TaskCompletedEnd);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCUSTOMERPERFORMANCE))).List<TMCUSTOMERPERFORMANCE>();
                session.EvictAll<TMCUSTOMERPERFORMANCE>();
                return lst.Count > 0 ? lst[0] : null;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}