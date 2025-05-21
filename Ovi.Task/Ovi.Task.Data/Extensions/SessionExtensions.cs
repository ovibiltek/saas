using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using NHibernate;
using NHibernate.Type;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Extensions
{
    public static class SessionExtensions
    {

        private static readonly object locker = new object();

        public static void EvictAll<T>(this ISession session)
        {
            var sessionImplementation = session.GetSessionImplementation();
            var entities = sessionImplementation.PersistenceContext.EntityEntries.Keys.OfType<T>();
            foreach (var e in entities.ToList())
                session.Evict(e);
        }

        public static void EvictAll(this ISession session, Type t)
        {
            var sessionImplementation = session.GetSessionImplementation();
            var entities = sessionImplementation.PersistenceContext.EntityEntries.Keys;
            var lst = (from object v in entities where v.GetType() == t select v).ToList();
            foreach (var e in lst)
                session.Evict(e);
        }

        public static List<object> Local(this ISession session, Type t)
        {
            var sessionImplementation = session.GetSessionImplementation();
            var entities = sessionImplementation.PersistenceContext.EntityEntries.Keys;
            return (from object v in entities where v.GetType() == t select v).ToList();
        }

        public static IEnumerable<T> Local<T>(this ISession session)
        {
            var sessionImplementation = session.GetSessionImplementation();
            var entities = sessionImplementation.PersistenceContext.EntityEntries.Keys.OfType<T>();
            return entities;
        }

        public static T GetAndEvict<T>(this ISession session, object o)
        {
            lock (locker)
            {
                var r = session.Get<T>(o);
                session.Evict(r);
                return r.Copy();
            }
        }

        public static void SaveOrUpdateAndEvict(this ISession session, object o)
        {
            lock (locker)
            {
                session.SaveOrUpdate(o);
                session.Flush();
                session.Refresh(o);
                session.Evict(o);
            }
        }

        public static void SaveOrUpdateAndEvict(this ISession session, object o, bool insert)
        {
            lock (locker)
            {
                if (insert)
                    session.Save(o);
                else
                    session.Update(o);

                session.Flush();
                session.Refresh(o);
                session.Evict(o);
            }
        }

        public static void DeleteAndFlush(this ISession session, object o)
        {
            lock (locker)
            {
                session.Delete(o);
                session.Flush();
            }
        }

        public static int DeleteAndFlush(this ISession session, string query, object[] values, IType[] types)
        {
            lock (locker)
            {
                var result = session.Delete(query, values, types);
                session.Flush();
                return result;
            }
        }

        public static int DeleteAndFlush(this ISession session, string query, object value, IType type)
        {
            lock (locker)
            {
                var result = session.Delete(query, value, type);
                session.Flush();
                return result;
            }
        }

        public static void SetPackageVariable(this ISession session, string package, string variable, string value)
        {
            IDbCommand command = new SqlCommand { CommandType = CommandType.StoredProcedure, CommandText = "TM_SET_PCKG_VARIABLE" };
            command.Connection = session.Connection;
            command.Parameters.Add(new SqlParameter("@sPckg", package));
            command.Parameters.Add(new SqlParameter("@sVariable", variable));
            command.Parameters.Add(new SqlParameter("@sValue", value));

            if (session.Transaction.IsActive)
                session.Transaction.Enlist(command);

            command.ExecuteNonQuery();
        }

        public static string GetPackageVariable(this ISession session, string package, string variable)
        {

            IDbCommand command = new SqlCommand { CommandType = CommandType.StoredProcedure, CommandText = "TM_GET_PCKG_VARIABLE" };

            command.Connection = session.Connection;
            command.Parameters.Add(new SqlParameter("@sPckg", package));
            command.Parameters.Add(new SqlParameter("@sVariable", variable));
            command.Parameters.Add(new SqlParameter("@sValue", SqlDbType.NVarChar, 2000) { Direction = ParameterDirection.Output });

            if (session.Transaction.IsActive)
                session.Transaction.Enlist(command);

            command.ExecuteNonQuery();

            var packvar = ((SqlParameter)command.Parameters["@sValue"]).Value.ToString();
            return packvar;
        }

        public static void SetTransactionIsolationLevel(this ISession session, IsolationLevel iLevel)
        {
            switch (iLevel)
            {
                case IsolationLevel.ReadUncommitted:
                    session.CreateSQLQuery("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
                    break;
                case IsolationLevel.ReadCommitted:
                    session.CreateSQLQuery("SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
                    break;
                default:
                    break;
            }
        }

        public static void SetPackageVariable(this IStatelessSession session, string package, string variable, string value)
        {
            IDbCommand command = new SqlCommand { CommandType = CommandType.StoredProcedure, CommandText = "TM_SET_PCKG_VARIABLE" };
            command.Connection = session.Connection;
            command.Parameters.Add(new SqlParameter("@sPckg", package));
            command.Parameters.Add(new SqlParameter("@sVariable", variable));
            command.Parameters.Add(new SqlParameter("@sValue", value));

            if (session.Transaction.IsActive)
                session.Transaction.Enlist(command);

            command.ExecuteNonQuery();
        }

        public static string GetPackageVariable(this IStatelessSession session, string package, string variable)
        {

            IDbCommand command = new SqlCommand { CommandType = CommandType.StoredProcedure, CommandText = "TM_GET_PCKG_VARIABLE" };

            command.Connection = session.Connection;
            command.Parameters.Add(new SqlParameter("@sPckg", package));
            command.Parameters.Add(new SqlParameter("@sVariable", variable));
            command.Parameters.Add(new SqlParameter("@sValue", SqlDbType.NVarChar, 2000) { Direction = ParameterDirection.Output });

            if (session.Transaction.IsActive)
                session.Transaction.Enlist(command);

            command.ExecuteNonQuery();

            var packvar = ((SqlParameter)command.Parameters["@sValue"]).Value.ToString();
            return packvar;
        }
    }
}