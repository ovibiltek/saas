using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using Ovi.Task.Helper.Shared;
using System.Collections;
using Ovi.Task.Data.Data_Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryKPI : BaseRepository<TMKPI, string>
    {
        public class ChartData
        {
            public object Data { get; set; }

            public string Type { get; set; }

            public string Description { get; set; }

            public int? MinValue { get; set; }

            public int? MaxValue { get; set; }

            public string Threshold { get; set; }

            public int? Size { get; set; }

            public string UserInfo { get; set; }

        }

        public class KPIParams
        {
            public string KPI { get; set; }

            public int? Year { get; set; }

            public int? Month { get; set; }
            public string Param { get; set; }
            public DateTime? FromDate { get; set; }
            public DateTime? ToDate { get; set; }
            public string Region { get; set; }
            public string Customer { get; set; }

        }

        public bool ValidateKPI(string kpicode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMKPI>();

                var kpi = session.GetAndEvict<TMKPI>(kpicode);
                kpi.KPI_SQL = SqlQueryHelper.SecureSql(kpi.KPI_SQL);
                var query = kpi.KPI_SQL.Replace(":USER", "TEST")
                    .Replace(":USERDEPARTMENT", "TEST")
                    .Replace(":YEAR", "-1")
                    .Replace(":MONTH", "-1")
                    .Replace(":USERGROUP", "TEST")
                    .Replace(":PRM", "null")
                    .Replace(":FROMDATE", "20000101")
                    .Replace(":TODATE", "20990101")
                    .Replace(":REGION","TEST")
                    .Replace(":CUSTOMER", "TEST");


                var res = session.CreateSQLQuery(query).SetReadOnly(true).List();
                kpi.KPI_ISVALIDATED = "+";
                session.SaveOrUpdateAndEvict(kpi);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMKPI> ListByUser(string user)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();

                IQuery query = session.CreateSQLQuery("EXEC TM_KPILISTBYUSER @PUSER=:user").SetReadOnly(true);
                query.SetString("user", user);
                var kpilist = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMKPI))).List<TMKPI>();
                session.EvictAll<TMKPI>();
                return kpilist;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMKPI> ListByUserAndGroup(string user, string group)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();

                IQuery query = session.CreateSQLQuery("EXEC TM_KPILISTBYUSERANDGROUP @PUSER=:user, @PGROUP=:group").SetReadOnly(true);
                query.SetString("user", user);
                query.SetString("group", group);
                var kpilist = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMKPI))).List<TMKPI>();
                session.EvictAll<TMKPI>();
                return kpilist;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public object GetData(KPIParams kpiprms, string user)
        {
            try
            {
                if (!kpiprms.Year.HasValue) kpiprms.Year = -1;
                if (!kpiprms.Month.HasValue) kpiprms.Month = -1;


                var session = NHibernateSessionManager.Instance.GetSession();
                session.BeginTransaction(IsolationLevel.ReadUncommitted);

                session.EvictAll<TMKPI>();

                var usr = new RepositoryUsers().Get(user);
                var kpi = session.GetAndEvict<TMKPI>(kpiprms.KPI);
                var query = session.CreateSQLQuery(kpi.KPI_SQL.Replace(":USER", user)
                    .Replace(":USERDEPARTMENT", usr.USR_DEPARTMENT)
                    .Replace(":YEAR", kpiprms.Year.ToString())
                    .Replace(":MONTH", kpiprms.Month.ToString())
                    .Replace(":USERGROUP", usr.USR_GROUP)
                    .Replace(":PRM", !string.IsNullOrEmpty(kpiprms.Param) ? kpiprms.Param : string.Empty)
                    .Replace(":FROMDATE",
                        kpiprms.FromDate.HasValue ? kpiprms.FromDate.Value.ToString(OviShared.SqlDate) : "20000101")
                    .Replace(":TODATE",
                        kpiprms.ToDate.HasValue ? kpiprms.ToDate.Value.ToString(OviShared.SqlDate) : "20990101")
                    .Replace(":USERGROUP", usr.USR_GROUP)
                    .Replace(":REGION",!string.IsNullOrEmpty(kpiprms.Region) ? kpiprms.Region:string.Empty)
                    .Replace(":CUSTOMER", !string.IsNullOrEmpty(kpiprms.Customer) ? kpiprms.Customer : string.Empty));

                if (kpi.KPI_TYPE.ToLower() == "bar") query.SetResultTransformer(Transformers.AliasToEntityMap);
                var data = query.List();


                session.Transaction.Commit();
                return new ChartData
                {
                    Description = kpi.KPI_DESCF,
                    Data = data,
                    Type = kpi.KPI_TYPE,
                    MinValue = kpi.KPI_MINVALUE,
                    MaxValue = kpi.KPI_MAXVALUE,
                    Threshold = kpi.KPI_THRESHOLD,
                    Size = kpi.KPI_SIZE,
                    UserInfo = kpi.KPI_USERINFO
                };
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public override bool DeleteById(string id)
        {
            try
            {
                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMKPI", "KPI_DESC", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}