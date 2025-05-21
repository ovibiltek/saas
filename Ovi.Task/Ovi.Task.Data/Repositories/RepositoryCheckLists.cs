using System;
using System.Collections.Generic;
using System.Linq;
using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCheckLists : BaseRepository<TMCHECKLISTS, long>
    {
        public class CopyChecklistItem
        {
            public string Subject1 { get; set; }
            public string Source1 { get; set; }
            public int Line1 { get; set; }
            public string Subject2 { get; set; }
            public string Source2 { get; set; }
            public string CreatedBy { get; set; }
        }

        public class ChecklistItem
        {
            public string Subject { get; set; }
            public string Source { get; set; }
            public int Line { get; set; }
            public int To { get; set; }
            public int FromOrder { get; set; }
            public int ToOrder { get; set; }
        }

        public IList<TMCHECKLISTS> GetBySourceAndSubject(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCHECKLISTS>()
                    .Where(x => x.CHK_SOURCE == source)
                    .And(x => x.CHK_SUBJECT == subject)
                    .List();
                session.EvictAll<TMCHECKLISTS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool CopyChecklist(CopyChecklistItem cclistitem)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_COPYCHKLISTITEM @psubject1=:subject1, " +
                                                      "@psource1=:source1, " +
                                                      "@pline1=:line1, " +
                                                      "@psubject2=:subject2,  " +
                                                      "@psource2=:source2, " +
                                                      "@pcreatedby=:createdby");
                query.SetString("subject1", cclistitem.Subject1);
                query.SetString("source1", cclistitem.Source1);
                query.SetInt32("line1", cclistitem.Line1);
                query.SetString("subject2", cclistitem.Subject2);
                query.SetString("source2", cclistitem.Source2);
                query.SetString("createdby", cclistitem.CreatedBy);
                query.ExecuteUpdate();

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void MoveChecklistItem(ChecklistItem cli)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_UPDCHKLISTITEMORDER @psubject=:subject, " +
                                                      "@psource=:source, " +
                                                      "@pline=:line, " +
                                                      "@pto=:to,  " +
                                                      "@pfromorder=:fromorder, " +
                                                      "@ptoorder=:toorder");
                query.SetString("subject", cli.Subject);
                query.SetString("source", cli.Source);
                query.SetInt32("line", cli.Line);
                query.SetInt32("to", cli.To);
                query.SetInt32("fromorder", cli.FromOrder);
                query.SetInt32("toorder", cli.ToOrder);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void ReOrderChecklistItem(string subject, string source, int line)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REORDERUPDCHKLISTITEM @psubject=:subject, " +
                                                      "@psource=:source, @pline= :line");

                query.SetString("subject", subject);
                query.SetString("source", source);
                query.SetInt32("line", line);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveOrUpdateList(List<TMCHECKLISTS> checklist)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var chkitem in checklist)
                    session.SaveOrUpdateAndEvict(chkitem);
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCHECKLISTS> GetBySubjectAndSource(string subject, string[] source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var arrSize = 1000;
                var chkList = new List<TMCHECKLISTS>();

                if (source.Length > arrSize)
                {
                    var splittedTaskArr = source.Split(arrSize);
                    foreach (var arr in splittedTaskArr)
                    {
                        var l = session.QueryOver<TMCHECKLISTS>()
                            .Where(x => x.CHK_SUBJECT == subject)
                            .AndRestrictionOn(x => x.CHK_SOURCE).IsIn(arr.ToArray())
                            .List();
                        chkList.AddRange(l);

                    }
                }
                else
                {
                    var l = session.QueryOver<TMCHECKLISTS>()
                        .Where(x => x.CHK_SUBJECT == subject)
                        .AndRestrictionOn(x => x.CHK_SOURCE).IsIn(source)
                        .List();
                    chkList.AddRange(l);
                }

                session.EvictAll<TMCHECKLISTS>();
                return (chkList.Count > 0 ? chkList : null);


            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}