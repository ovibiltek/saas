using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Cache;
using NHibernate.Context;
using NHibernate.Engine;
using NHibernate.Type;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Data;

namespace Ovi.Task.Data.Configuration
{
    /// <summary>
    /// Handles creation and management of sessions and transactions.  It is a singleton because
    /// building the initial session factory is very expensive. Inspiration for this class came
    /// from Chapter 8 of Hibernate in Action by Bauer and King.  Although it is a sealed singleton
    /// you can use TypeMock (http://www.typemock.com) for more flexible testing.
    /// </summary>
    public sealed class NHibernateSessionManager
    {
        #region Thread-safe, lazy Singleton

        private static readonly object syncRoot = new object();
         
        public static NHibernateSessionManager Instance
        {
            get
            {
                if (Nested.NHibernateSessionManager == null)
                {
                    lock (syncRoot)
                    {
                        if (Nested.NHibernateSessionManager == null)
                        {
                            Nested.NHibernateSessionManager = new NHibernateSessionManager();
                        }
                    }
                }
                return Nested.NHibernateSessionManager;
            }
        }

        private NHibernateSessionManager()
        {
            InitSessionFactory();
        }

        private class Nested
        {
            internal static NHibernateSessionManager NHibernateSessionManager;
        }

        #endregion Thread-safe, lazy Singleton

        private void InitSessionFactory()
        {
            sessionFactory = Fluently.Configure().Database(MsSqlConfiguration.MsSql2008.ConnectionString(DbSettings.ConnectionString).ShowSql())
                                .Cache(x => x.ProviderClass(typeof(NoCacheProvider).AssemblyQualifiedName))
                                .Mappings(m => m.FluentMappings.AddFromAssemblyOf<TMUSERS>())
                                .ExposeConfiguration(cfg =>
                                 {
                                     cfg.AddFilterDefinition(new FilterDefinition(
                                         "SessionContext",
                                         null,
                                         new Dictionary<string, IType>
                                         {
                                             { "User", NHibernateUtil.String },
                                             { "Language", NHibernateUtil.String },
                                             { "UserGroup", NHibernateUtil.String},
                                             { "Trade", NHibernateUtil.String},
                                             { "Customer" , NHibernateUtil.String },
                                             { "Supplier" , NHibernateUtil.String },
                                             { "System" , NHibernateUtil.String }
                                         },
                                         false));

                                     cfg.SetProperty("cache.provider_class", "NHibernate.Cache.NoCacheProvider");
                                     cfg.SetProperty("cache.use_second_level_cache", "false");
                                     cfg.SetProperty("cache.use_query_cache", "false");
                                     cfg.SetProperty("current_session_context_class", "web");
                                     cfg.SetProperty("command_timeout", "60");
                                 })
                                .BuildSessionFactory();
        }


        public ISession GetSession()
        {
            var factory = sessionFactory;
            ISession session;
            if (CurrentSessionContext.HasBind(factory))
            {
                session = factory.GetCurrentSession();
            }
            else
            {
                session = factory.OpenSession();
                CurrentSessionContext.Bind(session);
            }
            session.SetPackageVariable("CORE", "USER", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Code : "");
            session.SetPackageVariable("CORE", "LANG", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Language : "EN");
            session.SetPackageVariable("CORE", "USERGROUP", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.UserGroup : "");
            session.SetPackageVariable("CORE", "TRADE", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Trade : "");
            session.SetPackageVariable("CORE", "SYSTEM", "TMS");

            session.EnableFilter("SessionContext")
                .SetParameter("User", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Code : null)
                .SetParameter("Trade", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Trade : null)
                .SetParameter("Language", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Language : "EN")
                .SetParameter("UserGroup", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.UserGroup : null)
                .SetParameter("System", "TMS")
                .SetParameter("Customer", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Customer : null)
                .SetParameter("Supplier", ContextUserHelper.Instance.ContextUser != null ? ContextUserHelper.Instance.ContextUser.Supplier : null);


            return session;
        }

        public void CloseSession()
        {
            var factory = sessionFactory;
            using (var session = CurrentSessionContext.Unbind(factory))
            {
                if (session != null && session.IsOpen)
                {
                    try
                    {
                        if (session.Transaction != null && session.Transaction.IsActive)
                        {
                            session.Transaction.Rollback();
                        }
                    }
                    catch (HibernateException he)
                    {
                        var exc = ExceptionParser.Parse(he);
                        throw exc;
                    }
                    finally
                    {
                        session.Close();
                    }
                }
            }
        }

        public ITransaction BeginTransaction(IsolationLevel isolationLevel)
        {
            var session = GetSession();
            return session.BeginTransaction(isolationLevel);
        }

        public void CommitTransaction()
        {
            var factory = sessionFactory;
            using (var session = CurrentSessionContext.Unbind(factory))
            {
                if (session != null && session.IsOpen)
                {
                    try
                    {
                        if (session.Transaction.IsActive)
                        {
                            session.Transaction.Commit();
                        }
                    }
                    catch (HibernateException he)
                    {
                        var exc = ExceptionParser.Parse(he);
                        throw exc;
                    }
                    finally
                    {
                        session.Close();
                    }
                }
            }
        }

        public void RollbackTransaction()
        {
            var factory = sessionFactory;
            using (var session = CurrentSessionContext.Unbind(factory))
            {
                if (session != null && session.IsOpen)
                {
                    try
                    {
                        if (session.Transaction.IsActive)
                        {
                            session.Transaction.Rollback();
                        }
                    }
                    catch { }
                    finally
                    {
                        CloseSession();
                    }
                }
            }
        }

        public ISessionFactory GetSessionFactory()
        {
            throw new NotImplementedException();
        }

        private ISessionFactory sessionFactory;
    }
}