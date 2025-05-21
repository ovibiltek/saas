using System.Collections;
using System.Data;
using System.Linq;
using Newtonsoft.Json.Linq;
using NHibernate;
using NHibernate.Criterion;
using NHibernate.Transform;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Helper;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Data_Helper
{
    public class CriteriaHelperWithNoType
    {


        internal enum Logic
        {
            or,
            and
        }
        internal class MyCriteriaa
        {
            public string cr { get; set; }

            public Logic logic { get; set; }
        }
        internal class MyCriteria
        {
            public ICriterion cr { get; set; }

            public Logic logic { get; set; }
        }






        internal static MyCriteriaa BuildFilter(ISession sess, GridFilter gf)
        {

            var t = gf.FieldType;
            MyCriteriaa mca = null;
            QueryBuilder queryBuilder = new QueryBuilder();

            if (t == typeof(char) && (!new[] { "eq", "neq" }.Contains(gf.Operator)))
            {
                gf.Operator = "eq";
            }

            switch (gf.Operator)
            {
                case "eq":
                    mca = gf.Value == null ? new MyCriteriaa { cr = queryBuilder.IsNotNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) } : new MyCriteriaa { cr = queryBuilder.BuildBasic("eq", gf.Field, gf.Value, t), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "neq":
                    mca = gf.Value == null ? new MyCriteriaa { cr = queryBuilder.IsNotNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) } : new MyCriteriaa { cr = queryBuilder.Not(queryBuilder.BuildBasic("eq", gf.Field, gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "startswith":
                    mca = new MyCriteriaa { cr = queryBuilder.Like(gf.Field, gf.Value.ToString(), "start"), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "endswith":
                    mca = new MyCriteriaa { cr = queryBuilder.Like(gf.Field, gf.Value.ToString(), "end"), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "contains":
                    mca = new MyCriteriaa { cr = queryBuilder.Like(gf.Field, gf.Value.ToString(), "anywhere"), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "doesnotcontain":
                    mca = new MyCriteriaa { cr = queryBuilder.Not(queryBuilder.Like(gf.Field, gf.Value.ToString(), "anywhere")), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "in":
                    mca = new MyCriteriaa { cr = queryBuilder.In(gf.Field, (JArray)gf.Value, t), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "nin":
                    mca = new MyCriteriaa { cr = queryBuilder.Not(queryBuilder.In(gf.Field, (JArray)gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "sqlfunc":
                    mca = new MyCriteriaa { cr = queryBuilder.Sql(gf.Value), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "gte":
                    mca = new MyCriteriaa { cr = queryBuilder.BuildBasic("gte", gf.Field, gf.Value, t), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "gt":
                    mca = new MyCriteriaa { cr = queryBuilder.BuildBasic("gt", gf.Field, gf.Value, t), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "lt":
                    mca = new MyCriteriaa { cr = queryBuilder.BuildBasic("lt", gf.Field, gf.Value, t), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "lte":
                    mca = new MyCriteriaa { cr = queryBuilder.BuildBasic("lte", gf.Field, gf.Value, t), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "between":
                    mca = new MyCriteriaa { cr = queryBuilder.Logical("and", queryBuilder.BuildBasic("gte", gf.Field, gf.Value, t), queryBuilder.BuildBasic("lte", gf.Field, gf.Value2, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "isnotnull":
                    mca = new MyCriteriaa { cr = queryBuilder.IsNotNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "isnull":
                    mca = new MyCriteriaa { cr = queryBuilder.IsNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "isnull_equal":
                    mca = new MyCriteriaa { cr = queryBuilder.Logical("or", queryBuilder.IsNull(gf.Field), queryBuilder.BuildBasic("eq", gf.Field, gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                case "inbox":
                    var inbox = sess.Get<TMINBOX>(gf.Value);
                    mca = new MyCriteriaa { cr = queryBuilder.Sql(inbox.INB_CONDITION.Replace(":USER", gf.Value2.ToString())), logic = gf.Logic.ToEnum(Logic.and) };
                    break;
                default:
                    break;
            }




            return mca;
        }

        internal static ISQLQuery Build(ISession sess, GridRequest krg, string tableName)
        {

            if (krg == null)
            {

                return sess.CreateSQLQuery(SqlQueryHelper.SecureSql("SELECT * FROM " + tableName));
            }

            return (krg.groupedFilters != null && krg.groupedFilters.Count > 0) ? BuildGrouped(sess, krg, tableName) : BuildSingle(sess, krg, tableName);
        }

        internal static IList Run(ISession sess, GridRequest krg, string tableName)
        {
            IList listOfT = null;

            var hasActiveTransaction = sess.Transaction.IsActive;
            var newTransactionStarted = false;
            if (!hasActiveTransaction)
            {
                NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadUncommitted);
                newTransactionStarted = true;
            }
            var criteria = Build(sess, krg, tableName);
            criteria.SetResultTransformer(Transformers.AliasToEntityMap);

            listOfT = criteria.List();

            if (newTransactionStarted)
                NHibernateSessionManager.Instance.CommitTransaction();
            return listOfT;
        }

        internal static ISQLQuery Count(ISession sess, GridRequest krg, string tableName)
        {
            if (krg == null)
            {
                return sess.CreateSQLQuery(SqlQueryHelper.SecureSql("SELECT COUNT(*) FROM " + tableName));
            }

            return (krg.groupedFilters != null && krg.groupedFilters.Count > 0) ? BuildGroupedCount(sess, krg, tableName) : BuildSingleCount(sess, krg, tableName);

        }

        internal static ISQLQuery BuildSingleCount(ISession sess, GridRequest krg, string tableName)
        {
            var or = Restrictions.Disjunction();
            var and = Restrictions.Conjunction();
            var queryString = " ";
            var baseSql = "SELECT COUNT(*) FROM " + tableName;
            var cri = sess.CreateCriteria(tableName);

            var securityFilter = GetSecurityFilter(krg, tableName);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                queryString += "WHERE " + Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code));
            }

            if (krg == null)
            {
                return sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));
            }



            if (!(krg.filter == null || krg.filter.Filters == null))
            {
                var clist = new MyCriteriaa[krg.filter.Filters.Count];
                for (var i = 0; i < krg.filter.Filters.Count; i++)
                {
                    clist[i] = BuildFilter(sess, krg.filter.Filters[i]);
                }

                string orstr = "";
                string andstr = "";


                foreach (var c in clist)
                {
                    if (c != null)
                    {
                        switch (c.logic)
                        {
                            case Logic.or:
                                if (orstr.Length == 0)
                                    orstr += c.cr + " ";
                                else
                                    orstr += " or " + c.cr + " ";
                                break;

                            case Logic.and:
                                if (andstr.Length == 0)
                                    andstr += c.cr + " ";
                                else
                                    andstr += " and " + c.cr + " ";

                                break;
                        }
                    }
                }

                if ((andstr != "" || orstr != "") && string.IsNullOrEmpty(securityFilter))
                    queryString = queryString + " WHERE ";
                else if ((andstr != "" || orstr != "") && !string.IsNullOrEmpty(securityFilter))
                {
                    queryString += " and ";
                }

                if (andstr != "")
                {

                    queryString = queryString + " " + andstr;

                }

                if (orstr != "")
                {

                    queryString = queryString + " " + orstr;

                }





            }


            var criteria = sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));

            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static ISQLQuery BuildGroupedCount(ISession sess, GridRequest krg, string tableName)
        {
            var or = Restrictions.Disjunction();
            var and = Restrictions.Conjunction();
            var queryString = " ";
            string baseSql = "SELECT COUNT(*) FROM " + tableName;
            var cri = sess.CreateCriteria(tableName);

            var securityFilter = GetSecurityFilter(krg, tableName);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                queryString += "WHERE " + Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code));
            }

            if (krg == null)
            {
                return sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));
            }

            if (!(krg.filter == null || krg.filter.Filters == null))
            {


                string orstr = "";
                string andstr = "";

                foreach (var t in krg.groupedFilters)
                {

                    string gorstr = "";
                    string gandstr = "";
                    var f = t;
                    if (f != null || f.Filters != null)
                    {
                        var clist = new MyCriteriaa[f.Filters.Count];
                        for (var j = 0; j < f.Filters.Count; j++)
                        {
                            clist[j] = BuildFilter(sess, f.Filters[j]);
                        }

                        foreach (var c in clist)
                        {
                            if (c != null)
                            {
                                switch (c.logic)
                                {
                                    case Logic.or:
                                        if (gorstr.Length == 0)
                                            gorstr += c.cr + " ";
                                        else
                                            gorstr += " or " + c.cr + " ";
                                        break;

                                    case Logic.and:
                                        if (gandstr.Length == 0)
                                            gandstr += c.cr + " ";
                                        else
                                            gandstr += " and " + c.cr + " ";

                                        break;
                                }
                            }
                        }
                        gorstr = "(" + gorstr + ")";
                        gandstr = "(" + gandstr + ")";
                        var grouplogic = f.Logic.ToEnum(Logic.and);
                        switch (grouplogic)
                        {
                            case Logic.or:
                                if (gorstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gandstr + " ";
                                    else
                                        orstr += " or " + gandstr + " ";
                                }
                                if (gandstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gorstr + " ";
                                    else
                                        orstr += " or " + gandstr + " ";
                                }
                                break;
                            case Logic.and:
                                if (gorstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gandstr + " ";
                                    else
                                        orstr += " and " + gandstr + " ";
                                }
                                if (gandstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gorstr + " ";
                                    else
                                        orstr += " and " + gandstr + " ";
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }



                if ((andstr != "" || orstr != "") && string.IsNullOrEmpty(securityFilter))
                    queryString = queryString + " WHERE ";
                else if ((andstr != "" || orstr != "") && !string.IsNullOrEmpty(securityFilter))
                {
                    queryString += " and ";
                }

                if (andstr != "")
                {

                    queryString = queryString + " " + andstr;

                }

                if (orstr != "")
                {

                    queryString = queryString + " " + orstr;

                }

            }





            var criteria = sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));

            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static ISQLQuery BuildGrouped(ISession sess, GridRequest krg, string tableName)
        {

            var or = Restrictions.Disjunction();
            var and = Restrictions.Conjunction();
            var queryString = " ";
            string baseSql = "SELECT * FROM " + tableName;
            var cri = sess.CreateCriteria(tableName);

            var securityFilter = GetSecurityFilter(krg, tableName);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                queryString += "WHERE " + Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code));
            }

            if (krg == null)
            {
                return sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));
            }



            if (!(krg.filter == null || krg.filter.Filters == null))
            {


                string orstr = "";
                string andstr = "";

                foreach (var t in krg.groupedFilters)
                {

                    string gorstr = "";
                    string gandstr = "";
                    var f = t;
                    if (f != null || f.Filters != null)
                    {
                        var clist = new MyCriteriaa[f.Filters.Count];
                        for (var j = 0; j < f.Filters.Count; j++)
                        {
                            clist[j] = BuildFilter(sess, f.Filters[j]);
                        }

                        foreach (var c in clist)
                        {
                            if (c != null)
                            {
                                switch (c.logic)
                                {
                                    case Logic.or:
                                        if (gorstr.Length == 0)
                                            gorstr += c.cr + " ";
                                        else
                                            gorstr += " or " + c.cr + " ";
                                        break;

                                    case Logic.and:
                                        if (gandstr.Length == 0)
                                            gandstr += c.cr + " ";
                                        else
                                            gandstr += " and " + c.cr + " ";

                                        break;
                                }
                            }
                        }
                        gorstr = "(" + gorstr + ")";
                        gandstr = "(" + gandstr + ")";
                        var grouplogic = f.Logic.ToEnum(Logic.and);
                        switch (grouplogic)
                        {
                            case Logic.or:
                                if (gorstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gandstr + " ";
                                    else
                                        orstr += " or " + gandstr + " ";
                                }
                                if (gandstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gorstr + " ";
                                    else
                                        orstr += " or " + gandstr + " ";
                                }
                                break;
                            case Logic.and:
                                if (gorstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gandstr + " ";
                                    else
                                        orstr += " and " + gandstr + " ";
                                }
                                if (gandstr != "()")
                                {
                                    if (orstr.Length == 0)
                                        orstr += gorstr + " ";
                                    else
                                        orstr += " and " + gandstr + " ";
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }



                if ((andstr != "" || orstr != "") && string.IsNullOrEmpty(securityFilter))
                    queryString = queryString + " WHERE ";
                else if ((andstr != "" || orstr != "") && !string.IsNullOrEmpty(securityFilter))
                {
                    queryString += " and ";
                }

                if (andstr != "")
                {

                    queryString = queryString + " " + andstr;

                }

                if (orstr != "")
                {

                    queryString = queryString + " " + orstr;

                }

            }



            if (!(krg.sort == null || krg.sort.Count == 0))
            {
                queryString = queryString + " ORDER BY";
                foreach (var sortitem in krg.sort)
                {
                    switch (sortitem.Dir)
                    {
                        case "asc":

                            queryString = queryString + " " + Order.Asc(sortitem.Field).ToString();
                            break;

                        case "desc":

                            queryString = queryString + " " + Order.Asc(sortitem.Field).ToString();
                            break;

                        default:

                            queryString = queryString + " " + Order.Asc(sortitem.Field).ToString();
                            break;
                    }
                }
            }

            var criteria = sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));
            if (!krg.loadall)
            {
                criteria.SetMaxResults(krg.page * krg.pageSize);
            }
            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static ISQLQuery BuildSingle(ISession sess, GridRequest krg, string tableName)
        {
            var or = Restrictions.Disjunction();
            var and = Restrictions.Conjunction();
            var queryString = " ";
            string baseSql = "SELECT * FROM " + tableName;
            var cri = sess.CreateCriteria(tableName);

            var securityFilter = GetSecurityFilter(krg, tableName);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                queryString += "WHERE " + Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code));
            }

            if (krg == null)
            {
                return sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));
            }



            if (!(krg.filter == null || krg.filter.Filters == null))
            {
                var clist = new MyCriteriaa[krg.filter.Filters.Count];
                for (var i = 0; i < krg.filter.Filters.Count; i++)
                {
                    clist[i] = BuildFilter(sess, krg.filter.Filters[i]);
                }

                string orstr = "";
                string andstr = "";


                foreach (var c in clist)
                {
                    if (c != null)
                    {
                        switch (c.logic)
                        {
                            case Logic.or:
                                if (orstr.Length == 0)
                                    orstr += c.cr + " ";
                                else
                                    orstr += " or " + c.cr + " ";
                                break;

                            case Logic.and:
                                if (andstr.Length == 0)
                                    andstr += c.cr + " ";
                                else
                                    andstr += " and " + c.cr + " ";

                                break;
                        }
                    }
                }

                if ((andstr != "" || orstr != "") && string.IsNullOrEmpty(securityFilter))
                    queryString = queryString + " WHERE ";
                else if ((andstr != "" || orstr != "") && !string.IsNullOrEmpty(securityFilter))
                {
                    queryString += " and ";
                }
                if (andstr != "")
                {

                    queryString = queryString + " " + andstr;

                }

                if (orstr != "")
                {

                    queryString = queryString + " " + orstr;

                }





            }



            if (!(krg.sort == null || krg.sort.Count == 0))
            {
                queryString = queryString + " ORDER BY";

                for (int i = 0; i < krg.sort.Count; i++)
                {
                    var sort_item = krg.sort[i];
                    bool has_next = i + 1 < krg.sort.Count ? true : false;
                    switch (sort_item.Dir.ToLower())
                    {
                        case "asc":
                            if (has_next)
                                queryString = queryString + " " + Order.Asc(sort_item.Field).ToString() + ",";
                            else
                                queryString = queryString + " " + Order.Asc(sort_item.Field).ToString();
                            break;

                        case "desc":
                            if (has_next)
                                queryString = queryString + " " + Order.Desc(sort_item.Field).ToString() + ",";
                            else
                                queryString = queryString + " " + Order.Desc(sort_item.Field).ToString();
                            break;

                        default:
                            if (has_next)
                                queryString = queryString + " " + Order.Asc(sort_item.Field).ToString() + ",";
                            else
                                queryString = queryString + " " + Order.Asc(sort_item.Field).ToString();
                            break;
                    }
                }

            }

            var criteria = sess.CreateSQLQuery(SqlQueryHelper.SecureSql(baseSql + queryString));
            if (!krg.loadall)
            {
                criteria.SetMaxResults(krg.page * krg.pageSize);
            }
            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static string GetSecurityFilter(GridRequest krg, string tableName)
        {
            var repositoryScreens = new RepositoryScreens();

            var screen = repositoryScreens.Get(krg.screen);


            if (screen != null)
            {
                var repositoryMenu = new RepositoryMenu();
                var menu = repositoryMenu.GetSecurityFilter(ContextUserHelper.Instance.ContextUser.UserGroup, screen.SCR_CODE);
                if (menu != null && !string.IsNullOrEmpty(menu.MNU_SECURITYFILTER))
                {
                    var repositorySecurityFilter = new RepositorySecurityFilter();
                    var securityFilter = repositorySecurityFilter.Get(menu.MNU_SECURITYFILTER);
                    if (securityFilter.SCF_ACTIVE == '+')
                    {
                        return string.Format("({0})", securityFilter.SCF_CONDITION);
                    }
                }
            }
            return null;
        }
    }
}