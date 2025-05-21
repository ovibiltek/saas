using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using Ovi.Task.Data.Data_Helper;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryGridDesigner : BaseRepository<TMGRIDDESIGNER, int>
    {
        public System.Collections.IList GetColumns(string tableName)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                string query = "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME =N'" + tableName + "'";
                var sqlQuery = session.CreateSQLQuery(query).SetResultTransformer(Transformers.AliasToBean(typeof(ColumnModel)));
                var columnInfo = sqlQuery.List();
                return columnInfo;
            }
            catch (Exception e)
            {
                throw Exceptions.ExceptionHandler.Process(e);
            }
        }

        public System.Collections.IList GetTables(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();

                var str = CriteriaHelperWithNoType.Build(session, krg, "INFORMATION_SCHEMA.TABLES").SetResultTransformer(Transformers.AliasToBean(typeof(TableNameModel))).List();

                return str;
            }
            catch (Exception e)
            {
                throw Exceptions.ExceptionHandler.Process(e);
            }
        }

        public TMGRIDDESIGNER GetByScrCode(string scrcode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMGRIDDESIGNER>()
                        .Where(x => x.GRD_SCREENCODE == scrcode).FutureValue().Value;
                session.EvictAll<TMGRIDDESIGNER>();
                return l;
            }
            catch (Exception e)
            {
                throw Exceptions.ExceptionHandler.Process(e);
            }
        }

        public System.Collections.IList GetGridData(GridRequest gridreq, string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var list = CriteriaHelperWithNoType.Run(session, gridreq, code);
                return list;
            }
            catch (Exception e)
            {
                throw Exceptions.ExceptionHandler.Process(e);
            }
        }

        public long GetGridDataCount(GridRequest gridreq, string code)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var crit = CriteriaHelperWithNoType.Count(session, gridreq, code);
                var count = crit.List();
                long return_count = Convert.ToInt64(count[0]);
                return return_count;
            }
            catch (Exception e)
            {
                throw Exceptions.ExceptionHandler.Process(e);
            }

        }
    }
}