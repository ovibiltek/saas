using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Repositories
{
    public class TaskActivityFinderParameters
    {
        public int Task { get; set; }

        public DateTime? Date { get; set; }

        public int? Distance { get; set; }
    }

    public class TaskActivityDurationParameters
    {
        public string Trade { get; set; }

        public string Customer { get; set; }

        public string Type { get; set; }

        public string Category { get; set; }

        public string PeriodicTask { get; set; }

        public DateTime? DateStart { get; set; }

        public DateTime? DateEnd { get; set; }

        public int? Rownum { get; set; }
    }

    public class RepositoryTaskActivityDurationsMap
    {
        public IList<TM_TASKACTIVITYDURATIONSMAP> List(TaskActivityDurationParameters tadParams)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_TASKACTIVITYDURATIONSMAP  @PTRADE=:trade,"
                                                                                      + "@PCUSTOMER=:customer, "
                                                                                      + "@PTYPE=:type, "
                                                                                      + "@PCATEGORY=:category,"
                                                                                      + "@PPERIODICTASK=:periodictask,"
                                                                                      + "@PDATESTART=:datestart,"
                                                                                      + "@PDATEEND=:dateend,"
                                                                                      + "@PROWNUM=:rownum");
                query.SetString("trade", tadParams.Trade);
                query.SetString("customer", tadParams.Customer);
                query.SetString("type", tadParams.Type);
                query.SetString("category", tadParams.Category);
                query.SetString("periodictask", tadParams.PeriodicTask);
                query.SetDateTime("datestart", tadParams.DateStart);
                query.SetDateTime("dateend", tadParams.DateEnd);
                query.SetInt32("rownum", tadParams.Rownum);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_TASKACTIVITYDURATIONSMAP))).List<TM_TASKACTIVITYDURATIONSMAP>();
                session.EvictAll<TM_TASKACTIVITYDURATIONSMAP>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_TASKACTIVITYDURATIONSMAP> Find(TaskActivityFinderParameters tafParams)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_TASKACTIVITYDURATIONSMAP_FINDER  @PTASK=:task,"
                                                      + "@PDATE=:date, "
                                                      + "@PDISTANCE=:distance");
                query.SetInt32("task", tafParams.Task);
                query.SetDateTime("date", tafParams.Date);
                query.SetInt32("distance", tafParams.Distance);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_TASKACTIVITYDURATIONSMAP))).List<TM_TASKACTIVITYDURATIONSMAP>();
                session.EvictAll<TM_TASKACTIVITYDURATIONSMAP>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}