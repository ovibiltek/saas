using NHibernate;
using NHibernate.Impl;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using Ovi.Task.Helper;
using Ovi.Task.Helper.User;
using System;
using System.Collections.Generic;
using System.Data;
using static Ovi.Task.Data.Repositories.RepositoryInbox;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryConfirmations : BaseRepository<TMCONFIRMATIONS, int>
    {
        public class ConfirmationResult
        {
            public int CON_ID { get; set; }
            public string CON_MESSAGE { get; set; }

          
        }

        public class ConfirmationParams
        {
            public string Controller { get; set; }
            public string Variable { get; set; }

        }
        public bool ValidateConfirmation(int id)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMCONFIRMATIONS>();
               
                var conf = session.GetAndEvict<TMCONFIRMATIONS>(id);
                var paramlist = conf.CON_PARAMS.Split(',');
                var query = conf.CON_SQL;
                foreach ( var param in paramlist )
                {
                    var param_field = param.Split('=')[0].Trim();
                    var param_value = param.Split('=')[1].Trim();
                    query = query.Replace(param_field, param_value);
                }
                //var query = conf.CON_SQL.Replace(":P1", "0");
                var res = session.CreateSQLQuery(query).UniqueResult();
                conf.CON_ISVALIDATED = "+";
                session.SaveOrUpdateAndEvict(conf);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<ConfirmationResult> RunConfirmations(ConfirmationParams confirmationParams, DataTable dt)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.BeginTransaction(IsolationLevel.ReadUncommitted);
                IQuery query = session.CreateSQLQuery("EXEC TM_RUNCONFIRMATIONS @Controller=:controller, @dt=:dt");
                query.SetString("controller", confirmationParams.Controller);
                query.SetParameter("dt", dt, new MapTable());
                var confirmationList = query.SetResultTransformer(Transformers.AliasToBean(typeof(ConfirmationResult))).List<ConfirmationResult>();
                foreach (var conf in confirmationList)
                {
                    var message =Helper.MessageHelper.Get(conf.CON_MESSAGE, ContextUserHelper.Instance.ContextUser.Language);
                    conf.CON_MESSAGE = message;
                }
                session.EvictAll<ConfirmationResult>();
                session.Transaction.Commit();
                return confirmationList;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

       
    }
}