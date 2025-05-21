using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Data_Helper;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Data;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryInbox : BaseRepository<TMINBOX, string>
    {
        public class INBXCNT
        {
            public string INB_CODE { get; set; }

            public string INB_CSS { get; set; }

            public string INB_COLOR { get; set; }

            public string INB_HREF { get; set; }

            public string INB_TYPE { get; set; }

            public string INB_DESC { get; set; }

            public string INB_INFO { get; set; }

            public object INB_CNT { get; set; }

            public int INB_ORDER { get; set; }

            public string INB_VISIBLE { get; set; }

            public string INB_SHOWNONZERO { get; set; }

            public string INB_RESULTTYPE { get; set; }

            public int INB_UINID { get; set; }

        }

        public class INBXGROUP
        {
            public string INB_GROUP { get; set; }

            public string INB_GROUPDESC { get; set; }

            public string INB_USERGROUP { get; set; }

            public int? INB_GROUPCOUNT { get; set; }

        }

        public class RunInboxParams
        {
            public string InboxGroup { get; set; }

            public char ShowAll { get; set; }

            public string Screen { get; set; }

            public char Refresh { get; set; }

        }

        public bool ValidateInbox(string inboxcode)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMINBOX>();

                var inbox = session.GetAndEvict<TMINBOX>(inboxcode);
                var query = inbox.INB_SQL.Replace(":USER", "TEST")
                    .Replace(":USERDEPARTMENT", "TEST")
                    .Replace(":USERGROUP", "TEST");


                query = SqlQueryHelper.SecureSql(query);


                var res = session.CreateSQLQuery(query).List();
                inbox.INB_ISVALIDATED = '+';
                session.SaveOrUpdateAndEvict(inbox);

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<INBXCNT> RunInbxCnts(RunInboxParams rip)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.BeginTransaction(IsolationLevel.ReadUncommitted);
                IQuery query = session.CreateSQLQuery("EXEC TM_RUNINBCNT2 @pInboxGroup=:inboxgroup, @pShowAll=:showall, @pScreen=:screen");
                query.SetString("inboxgroup", rip.InboxGroup);
                query.SetString("screen", rip.Screen);
                query.SetCharacter("showall", rip.ShowAll);
                var countList = query.SetResultTransformer(Transformers.AliasToBean(typeof(INBXCNT))).List<INBXCNT>();
                session.EvictAll<INBXCNT>();
                session.Transaction.Commit();
                return countList;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<INBXCNT> RunInbxCntsCustomer(RunInboxParams runInboxParams)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.BeginTransaction(IsolationLevel.ReadUncommitted);
                IQuery query = session.CreateSQLQuery("EXEC TM_RUNINBCNTCUSTOMER @pInboxGroup=:inboxgroup, @pShowAll=:showall");
                query.SetString("inboxgroup", runInboxParams.InboxGroup);
                query.SetCharacter("showall", runInboxParams.ShowAll);
                var countList = query.SetResultTransformer(Transformers.AliasToBean(typeof(INBXCNT))).List<INBXCNT>();
                session.EvictAll<INBXCNT>();
                session.Transaction.Commit();
                return countList;
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
                repositoryDescriptions.DeleteDescriptions("TMINBOX", "INB_DESC", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<INBXGROUP> ListUserInboxes()
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.BeginTransaction(IsolationLevel.ReadUncommitted);
                IQuery query = session.CreateSQLQuery("EXEC TM_LISTUSERINBOXES");
                var inboxGroups = query.SetResultTransformer(Transformers.AliasToBean(typeof(INBXGROUP))).List<INBXGROUP>();
                session.EvictAll<INBXGROUP>();
                session.Transaction.Commit();
                return inboxGroups;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}