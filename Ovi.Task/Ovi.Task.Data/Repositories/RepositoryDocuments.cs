using NHibernate;
using NHibernate.Criterion;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryDocuments : BaseRepository<TMDOCSMETA, long>
    {
        public IList<object[]> ListDocumentPreviewInfo(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMDOCSMETA>();
                var criteria = CriteriaHelper<TMDOCSMETA>.Build(session, krg);
                criteria.SetProjection(Projections.ProjectionList()
                    .Add(Projections.Property("DOC_ID"), "DOC_ID")
                    .Add(Projections.Property("DOC_OFN"), "DOC_OFN")
                    .Add(Projections.Property("DOC_CONTENTTYPE"), "DOC_CONTENTTYPE")
                    .Add(Projections.Property("DOC_CREATED"), "DOC_CREATED")
                    .Add(Projections.Property("DOC_CREATEDBY"), "DOC_CREATEDBY")
                    .Add(Projections.Property("DOC_CREATEDBYDESC"), "DOC_CREATEDBYDESC"));
                return criteria.List<object[]>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDOCSMETA> ListDocumentPreviewInfo(DocumentModel f)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_GETDOCS @PSOURCE=:source, @PSUBJECT=:subject, @PSHOWALL=:showall");
                query.SetString("source", f.Source);
                query.SetString("subject", f.Subject);
                query.SetCharacter("showall", f.ShowAll);
                var lstdocuments = query.SetResultTransformer(Transformers.AliasToBean(typeof(TMDOCSMETA))).List<TMDOCSMETA>();
                session.EvictAll<TMDOCSMETA>();
                return lstdocuments;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDOCSMETA> ListBySubjectAndSource(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMDOCSMETA>()
                    .Where(x => x.DOC_SUBJECT == subject)
                    .And(x => x.DOC_SOURCE == source)
                    .List();

            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMDOCSMETA GetSingle(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMDOCSMETA>()
                    .Where(x => x.DOC_SUBJECT == subject)
                    .And(x => x.DOC_SOURCE == source)
                    .FutureValue<TMDOCSMETA>().Value;
                session.EvictAll<TMDOCSMETA>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDOCSMETA> List(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMDOCSMETA>()
                    .Where(x => x.DOC_SUBJECT == subject)
                    .And(x => x.DOC_SOURCE == source)
                    .List();
                session.EvictAll<TMDOCSMETA>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void DeleteDocument(string source, string subject, string doctype)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_DELDOC @psubject=:subject, @psource=:source, @pdoctype=:doctype");
                query.SetString("subject", subject);
                query.SetString("source", source);
                query.SetString("doctype", doctype);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public string CanActivityClose(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT dbo.CanActivityClosed(:subject,:source)");
                query.SetString("subject", subject);
                query.SetString("source", source);
                return query.UniqueResult<string>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool CheckUncheckDocument(TMDOCCHECK docCheck)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var checkrec = session.QueryOver<TMDOCCHECK>().Where(x => x.CHK_DOCID == docCheck.CHK_DOCID)
                    .FutureValue<TMDOCCHECK>().Value;

                session.Evict(checkrec);

                if (checkrec != null)
                {
                    docCheck.CHK_ID = checkrec.CHK_ID;
                    docCheck.CHK_CREATED = checkrec.CHK_CREATED;
                    docCheck.CHK_CREATEDBY = checkrec.CHK_CREATEDBY;
                    docCheck.CHK_RECORDVERSION = checkrec.CHK_RECORDVERSION;
                }
                else
                {
                    docCheck.CHK_ID = 0;
                    docCheck.CHK_UPDATED = null;
                    docCheck.CHK_UPDATEDBY = null;
                    docCheck.CHK_RECORDVERSION = 0;
                }
                session.SaveOrUpdateAndEvict(docCheck);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}