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
using System.Collections.Generic;
using System.Data;
using Environment = NHibernate.Cfg.Environment;


namespace Ovi.Task.Data.Configuration
{
    /// <summary>
    /// Handles creation and management of sessions and transactions.  It is a singleton because
    /// building the initial session factory is very expensive. Inspiration for this class came
    /// from Chapter 8 of Hibernate in Action by Bauer and King.  Although it is a sealed singleton
    /// you can use TypeMock (http://www.typemock.com) for more flexible testing.
    /// </summary>
    public sealed class NHibernateSessionManagerMcdb
    {
        #region Thread-safe, lazy Singleton

        private static readonly object syncRoot = new object();

        public static NHibernateSessionManagerMcdb Instance
        {
            get
            {
                if (Nested.NHibernateSessionManagerMcdb == null)
                {
                    lock (syncRoot)
                    {
                        if (Nested.NHibernateSessionManagerMcdb == null)
                        {
                            Nested.NHibernateSessionManagerMcdb = new NHibernateSessionManagerMcdb();
                        }
                    }
                }
                return Nested.NHibernateSessionManagerMcdb;
            }
        }

        private NHibernateSessionManagerMcdb()
        {
            InitSessionFactory();
        }

        private class Nested
        {
            internal static NHibernateSessionManagerMcdb NHibernateSessionManagerMcdb;
        }

        #endregion Thread-safe, lazy Singleton

        private void InitSessionFactory()
        {
            sessionFactory = Fluently.Configure().Database(MsSqlConfiguration.MsSql2008.ConnectionString(DbSettings.MailConfigurationDbConnectionString).ShowSql())
                .Cache(x => x.ProviderClass(typeof(NoCacheProvider).AssemblyQualifiedName))
                .Mappings(m => m.FluentMappings.AddFromAssemblyOf<TMMAILTEMPLATES>())
                .ExposeConfiguration(cfg =>
                {
                    cfg.SetProperty(Environment.CacheProvider, NHibernateConfigurationProperties.cache_provider_class);
                    cfg.SetProperty(Environment.UseSecondLevelCache, NHibernateConfigurationProperties.cache_use_second_level_cache);
                    cfg.SetProperty(Environment.UseQueryCache, NHibernateConfigurationProperties.cache_use_query_cache);
                    cfg.SetProperty(Environment.CommandTimeout, NHibernateConfigurationProperties.command_timeout);
                    cfg.SetProperty(Environment.CurrentSessionContextClass, NHibernateConfigurationProperties.current_session_context_class);
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

        private ISessionFactory sessionFactory;
    }
}