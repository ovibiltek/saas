using Newtonsoft.Json.Linq;
using NHibernate;
using NHibernate.Criterion;
using NHibernate.Loader.Custom.Sql;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Repositories;
using Ovi.Task.Helper.Functional;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using TB.ComponentModel;

namespace Ovi.Task.Data.Helper
{
    public class CriteriaHelper<T> where T : class
    {
        internal enum Logic
        {
            or,
            and
        }

        internal class MyCriteria
        {
            public ICriterion cr { get; set; }

            public Logic logic { get; set; }
        }

        internal static object ChangeType(object value, Type conversionType)
        {
            try
            {
                object result;
                UniversalTypeConverter.TryConvert(value, conversionType, out result);
                return result;
            }
            catch (Exception)
            {
                return false;
            }
        }

        internal static MyCriteria BuildFilter(ISession sess, GridFilter gf)
        {
            MyCriteria mc = null;
            var t = !string.IsNullOrEmpty(gf.Field)
                ? TypeHelper.GetType(typeof(T).GetProperty(gf.Field))
                : null;

            if (t == typeof(char) && (!new[] { "eq", "neq" }.Contains(gf.Operator)))
            {
                gf.Operator = "eq";
            }

            switch (gf.Operator)
            {
                case "eq":
                    mc = gf.Value == null ? new MyCriteria { cr = Restrictions.IsNotNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) } : new MyCriteria { cr = Restrictions.Eq(gf.Field, ChangeType(gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "neq":
                    mc = gf.Value == null ? new MyCriteria { cr = Restrictions.IsNotNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) } : new MyCriteria { cr = Restrictions.Not(Restrictions.Eq(gf.Field, ChangeType(gf.Value, t))), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "startswith":
                    mc = new MyCriteria { cr =Restrictions.Like(gf.Field, gf.Value.ToString(), MatchMode.Start), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "notstartswith":
                    mc = new MyCriteria { cr = Restrictions.Not(Restrictions.Like(gf.Field, gf.Value.ToString(), MatchMode.Start)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "endswith":
                    mc = new MyCriteria { cr = Restrictions.Like(gf.Field, gf.Value.ToString(), MatchMode.End), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "notendswith":
                    mc = new MyCriteria { cr = Restrictions.Not(Restrictions.Like(gf.Field, gf.Value.ToString(), MatchMode.End)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "contains":
                    mc = new MyCriteria { cr = Restrictions.Like(gf.Field, gf.Value.ToString(), MatchMode.Anywhere), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "doesnotcontain":
                    mc = new MyCriteria { cr = Restrictions.Not(Restrictions.Like(gf.Field, gf.Value.ToString(), MatchMode.Anywhere)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "in":
                    mc = new MyCriteria { cr = Restrictions.In(gf.Field, ((JArray)gf.Value)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "nin":
                    mc = new MyCriteria { cr = Restrictions.Not(Restrictions.In(gf.Field, ((JArray)gf.Value))), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "sqlfunc":
                    mc = new MyCriteria { cr = Expression.Sql(gf.Value.ToString()), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "gte":
                    mc = new MyCriteria { cr = Restrictions.Ge(gf.Field, ChangeType(gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "gt":
                    mc = new MyCriteria { cr = Restrictions.Gt(gf.Field, ChangeType(gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "lt":
                    mc = new MyCriteria { cr = Restrictions.Lt(gf.Field, ChangeType(gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "lte":
                    mc = new MyCriteria { cr = Restrictions.Le(gf.Field, ChangeType(gf.Value, t)), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "between":
                    mc = new MyCriteria { cr = Restrictions.And(Restrictions.Ge(gf.Field, ChangeType(gf.Value, t)), Restrictions.Le(gf.Field, ChangeType(gf.Value2, t))), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "isnotnull":
                    mc = new MyCriteria { cr = Restrictions.IsNotNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "isnull":
                    mc = new MyCriteria { cr = Restrictions.IsNull(gf.Field), logic = gf.Logic.ToEnum(Logic.and) };
                    break;

                case "isnull_equal":
                    mc = new MyCriteria { cr =  Restrictions.Or(Restrictions.IsNull(gf.Field),Restrictions.Eq(gf.Field, ChangeType(gf.Value, t))), logic = gf.Logic.ToEnum(Logic.and)};
                    break;
                case "inbox":
                    var inbox = sess.Get<TMINBOX>(gf.Value);
                    if (!string.IsNullOrEmpty(inbox.INB_CONDITION))
                    {
                        mc = new MyCriteria { cr = Expression.Sql(inbox
                            .INB_CONDITION.Replace(":USER", gf.Value2.ToString())), 
                            logic = gf.Logic.ToEnum(Logic.and) };
                    }

                    break;
            }


            return mc;
        }

        internal static ICriteria Build(ISession sess, GridRequest krg)
        {
            if (krg == null)
            {
                return sess.CreateCriteria<T>();
            }

            return (krg.groupedFilters != null && krg.groupedFilters.Count > 0) ? BuildGrouped(sess, krg) : BuildSingle(sess, krg);
        }

        internal static IList<T> Run(ISession sess, GridRequest krg)
        {
            IList<T> listOfT = null;

            var hasActiveTransaction = sess.Transaction.IsActive;
            var newTransactionStarted = false;
            if (!hasActiveTransaction)
            {
                NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadUncommitted);
                newTransactionStarted = true;
            }
            var criteria = Build(sess, krg);
            if (krg.exportall)
            {
                var fields = PropertyHelper<T>.ListExcludedWhenExport();
                var projectionList = Projections.ProjectionList();
                foreach (var f in fields)
                {
                    projectionList.Add(Projections.Property(f), f);
                }

                criteria.SetProjection(projectionList);
                criteria.SetResultTransformer(NHibernate.Transform.Transformers.AliasToBean(typeof(T)));
                listOfT = criteria.List<T>();
            }
            else
            {
                listOfT = criteria.List<T>();
                sess.EvictAll<T>();
            }
            if (newTransactionStarted)
                NHibernateSessionManager.Instance.CommitTransaction();
            return listOfT;
        }

        internal static ICriteria Count(ISession sess, GridRequest krg)
        {
            if (krg == null)
            {
                return sess.CreateCriteria<T>();
            }

            return (krg.groupedFilters != null && krg.groupedFilters.Count > 0) ? BuildGroupedCount(sess, krg) : BuildSingleCount(sess, krg);
        }

        internal static ICriteria BuildSingleCount(ISession sess, GridRequest krg)
        {
            var or = Restrictions.Disjunction();
            var and = Restrictions.Conjunction();

            var criteria = sess.CreateCriteria<T>();
            var securityFilter = GetSecurityFilter(krg);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                criteria.Add(Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code)));
            }

            criteria.SetProjection(Projections.RowCountInt64());

            if (krg == null)
            {
                return criteria;
            }

            if (!krg.loadall)
            {
                criteria.SetMaxResults(krg.page * krg.pageSize);
            }

            if (krg.filter == null || krg.filter.Filters == null)
            {
                return criteria;
            }

            var clist = new MyCriteria[krg.filter.Filters.Count];

            for (var i = 0; i < krg.filter.Filters.Count; i++)
            {
                clist[i] = BuildFilter(sess, krg.filter.Filters[i]);
            }

            foreach (var c in clist)
            {
                if (c != null)
                {
                    switch (c.logic)
                    {
                        case Logic.or:
                            or.Add(c.cr);
                            break;

                        case Logic.and:
                            and.Add(c.cr);
                            break;
                    }
                }
            }

            if (or.ToString() != "()")
            {
                criteria.Add(or);
            }

            if (and.ToString() != "()")
            {
                criteria.Add(and);
            }

            criteria.SetCacheMode(CacheMode.Refresh);
            return criteria;
        }

        internal static ICriteria BuildGroupedCount(ISession sess, GridRequest krg)
        {
            var criteria = sess.CreateCriteria<T>();
            var securityFilter = GetSecurityFilter(krg);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                criteria.Add(Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code)));
            }

            criteria.SetProjection(Projections.RowCountInt64());

            if (krg == null)
            {
                return criteria;
            }

            if (!krg.loadall)
            {
                criteria.SetMaxResults(krg.page * krg.pageSize);
            }

            var gfor = Restrictions.Disjunction();
            var gfand = Restrictions.Conjunction();

            foreach (var t in krg.groupedFilters)
            {
                var gfior = Restrictions.Disjunction();
                var gfiand = Restrictions.Conjunction();

                var f = t;
                if (f == null || f.Filters == null)
                {
                    return criteria;
                }

                var clist = new MyCriteria[f.Filters.Count];

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
                                gfior.Add(c.cr);
                                break;

                            case Logic.and:
                                gfiand.Add(c.cr);
                                break;
                        }
                    }
                }

                var grouplogic = f.Logic.ToEnum(Logic.and);
                switch (grouplogic)
                {
                    case Logic.or:
                        if (gfior.ToString() != "()")
                        {
                            gfor.Add(gfior);
                        }

                        if (gfiand.ToString() != "()")
                        {
                            gfor.Add(gfiand);
                        }

                        break;

                    case Logic.and:
                        if (gfior.ToString() != "()")
                        {
                            gfand.Add(gfior);
                        }

                        if (gfiand.ToString() != "()")
                        {
                            gfand.Add(gfiand);
                        }

                        break;
                }
            }

            if (gfor.ToString() != "()")
            {
                criteria.Add(gfor);
            }

            if (gfand.ToString() != "()")
            {
                criteria.Add(gfand);
            }

            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static ICriteria BuildGrouped(ISession sess, GridRequest krg)
        {
            var criteria = sess.CreateCriteria<T>();
            var securityFilter = GetSecurityFilter(krg);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                criteria.Add(Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code)));
            }

            if (krg == null)
            {
                return criteria;
            }

            if (!krg.loadall)
            {
                if (krg.skip.HasValue)
                {
                    criteria.SetFirstResult(krg.skip.Value * krg.pageSize);
                    criteria.SetMaxResults(krg.pageSize);
                }
                else
                {
                    criteria.SetMaxResults(krg.page * krg.pageSize);
                }
            }

            if (krg.sort != null)
            {
                foreach (var sortitem in krg.sort)
                {
                    switch (sortitem.Dir)
                    {
                        case "asc":
                            criteria.AddOrder(Order.Asc(sortitem.Field));
                            break;

                        case "desc":
                            criteria.AddOrder(Order.Desc(sortitem.Field));
                            break;

                        default:
                            criteria.AddOrder(Order.Asc(sortitem.Field));
                            break;
                    }
                }
            }

            var gfor = Restrictions.Disjunction();
            var gfand = Restrictions.Conjunction();

            foreach (var t in krg.groupedFilters)
            {
                var gfior = Restrictions.Disjunction();
                var gfiand = Restrictions.Conjunction();

                var f = t;
                if (f == null || f.Filters == null)
                {
                    return criteria;
                }

                var clist = new MyCriteria[f.Filters.Count];

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
                                gfior.Add(c.cr);
                                break;

                            case Logic.and:
                                gfiand.Add(c.cr);
                                break;
                        }
                    }
                }

                var grouplogic = f.Logic.ToEnum(Logic.and);
                switch (grouplogic)
                {
                    case Logic.or:
                        if (gfior.ToString() != "()")
                        {
                            gfor.Add(gfior);
                        }

                        if (gfiand.ToString() != "()")
                        {
                            gfor.Add(gfiand);
                        }

                        break;

                    case Logic.and:
                        if (gfior.ToString() != "()")
                        {
                            gfand.Add(gfior);
                        }

                        if (gfiand.ToString() != "()")
                        {
                            gfand.Add(gfiand);
                        }

                        break;
                }
            }

            if (gfor.ToString() != "()")
            {
                criteria.Add(gfor);
            }

            if (gfand.ToString() != "()")
            {
                criteria.Add(gfand);
            }

            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static ICriteria BuildSingle(ISession sess, GridRequest krg)
        {
            var or = Restrictions.Disjunction();
            var and = Restrictions.Conjunction();

            var criteria = sess.CreateCriteria<T>();
            var securityFilter = GetSecurityFilter(krg);
            if (!string.IsNullOrEmpty(securityFilter))
            {
                criteria.Add(Expression.Sql(securityFilter.Replace(":USER", ContextUserHelper.Instance.ContextUser.Code)));
            }

            if (krg == null)
            {
                return criteria;
            }

            if (!krg.loadall)
            {
                if (krg.skip.HasValue)
                {
                    criteria.SetFirstResult(krg.skip.Value * krg.pageSize);
                    criteria.SetMaxResults(krg.pageSize);
                }
                else
                {
                    criteria.SetMaxResults(krg.page * krg.pageSize);
                }
            }

            if (krg.sort != null)
            {
                foreach (var sortitem in krg.sort)
                {
                    switch (sortitem.Dir)
                    {
                        case "asc":
                            criteria.AddOrder(Order.Asc(sortitem.Field));
                            break;

                        case "desc":
                            criteria.AddOrder(Order.Desc(sortitem.Field));
                            break;

                        default:
                            criteria.AddOrder(Order.Asc(sortitem.Field));
                            break;
                    }
                }
            }

            if (krg.filter == null || krg.filter.Filters == null)
            {
                return criteria;
            }

            var clist = new MyCriteria[krg.filter.Filters.Count];
            for (var i = 0; i < krg.filter.Filters.Count; i++)
            {
                clist[i] = BuildFilter(sess, krg.filter.Filters[i]);
            }

            foreach (var c in clist)
            {
                if (c != null)
                {
                    switch (c.logic)
                    {
                        case Logic.or:
                            or.Add(c.cr);
                            break;

                        case Logic.and:
                            and.Add(c.cr);
                            break;
                    }
                }
            }

            if (or.ToString() != "()")
            {
                criteria.Add(or);
            }

            if (and.ToString() != "()")
            {
                criteria.Add(and);
            }

            criteria.SetCacheMode(CacheMode.Refresh);

            return criteria;
        }

        internal static string GetSecurityFilter(GridRequest krg)
        {
            var repositoryScreens = new RepositoryScreens();
            var classname = typeof(T).Name;
            var screen = string.IsNullOrEmpty(krg.screen)
                ? repositoryScreens.GetByClass(classname)
                : repositoryScreens.Get(krg.screen);

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

        private static string BuildSqlExpression(string fieldName, string operatorName, object value, Dictionary<string, object> sqlParameters)
        {
            if (string.IsNullOrEmpty(fieldName)) throw new ArgumentException("Field name cannot be null or empty.", nameof(fieldName));
            if (string.IsNullOrEmpty(operatorName)) throw new ArgumentException("Operator cannot be null or empty.", nameof(operatorName));
            if (sqlParameters == null) throw new ArgumentNullException(nameof(sqlParameters), "SQL parameters dictionary cannot be null.");

            var parameterName = $"{fieldName}_param";

            switch (operatorName.ToLower())
            {
                case "eq":
                    sqlParameters[parameterName] = value;
                    return $"{fieldName} = :{parameterName}";
                case "neq":
                    sqlParameters[parameterName] = value;
                    return $"{fieldName} != :{parameterName}";
                case "gt":
                    sqlParameters[parameterName] = value;
                    return $"{fieldName} > :{parameterName}";
                case "lt":
                    sqlParameters[parameterName] = value;
                    return $"{fieldName} < :{parameterName}";
                case "gte":
                    sqlParameters[parameterName] = value;
                    return $"{fieldName} >= :{parameterName}";
                case "lte":
                    sqlParameters[parameterName] = value;
                    return $"{fieldName} <= :{parameterName}";
                case "startswith":
                    sqlParameters[parameterName] = $"{value}%";
                    return $"{fieldName} LIKE :{parameterName}";
                case "contains":
                    sqlParameters[parameterName] = $"%{value}%";
                    return $"{fieldName} LIKE :{parameterName}";
                case "endswith":
                    sqlParameters[parameterName] = $"%{value}";
                    return $"{fieldName} LIKE :{parameterName}";
                case "isnotnull":
                    return $"{fieldName} IS NOT NULL";
                case "isnull":
                    return $"{fieldName} IS NULL";
                default:
                    throw new NotSupportedException($"Operator '{operatorName}' is not supported.");
            }
        }

        internal static IList<T> RunTableValuedFunction(
            ISession session,
            string functionName,
            Dictionary<string, object> parameters,
            GridRequest gridRequest)
        {
            IList<T> result = null;

            // Sorguyu başlat
            var queryBuilder = $"SELECT * FROM {functionName}(";
            queryBuilder += string.Join(", ", parameters.Values.Select(v => v == null ? "NULL" : (v is string ? $"'{v}'" : v.ToString())));
            queryBuilder += ")";


            // GridRequest'ten parametrelerle eşleşen filtreleri çıkar
            var filteredFilters = gridRequest.filter.Filters
                .Where(f => !parameters.Keys.Any(p => p.Equals(f.Field, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            // SQL filtre parametrelerini yeni bir dictionary'de tut
            var sqlParameters = new Dictionary<string, object>();

            // Filtreleme ekle
            if (filteredFilters.Any())
            {
                var filterConditions = new List<string>();

                foreach (var filter in filteredFilters)
                {
                    var sqlExpression = BuildSqlExpression(
                        filter.Field,
                        filter.Operator,
                        filter.Value,
                        sqlParameters
                    );
                    filterConditions.Add(sqlExpression);
                }

                queryBuilder += " WHERE " + string.Join(" AND ", filterConditions);
            }

            // Sıralama ekle
            if (gridRequest.sort != null && gridRequest.sort.Any())
            {
                var sortExpressions = gridRequest.sort
                    .Select(s => $"{s.Field} {s.Dir.ToUpper()}");
                queryBuilder += " ORDER BY " + string.Join(", ", sortExpressions);
            }


            // Sorguyu çalıştır
            var sqlQuery = session.CreateSQLQuery(queryBuilder);

            foreach (var param in sqlParameters)
            {
                sqlQuery.SetParameter(param.Key, param.Value);
            }

            result = sqlQuery
                .SetResultTransformer(NHibernate.Transform.Transformers.AliasToBean(typeof(T)))
                .List<T>();

            return result;
        }
    }
}