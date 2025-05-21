using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCheckListTemplateLines : BaseRepository<TMCHECKLISTTEMPLATELINES, long>
    {
        public class ChecklistItem
        {
            public string Subject { get; set; }

            public string Source { get; set; }

            public long To { get; set; }

            public long FromOrder { get; set; }

            public long ToOrder { get; set; }
        }

        public void MoveChecklistItem(ChecklistItem cli)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_UPDCHKLISTTEMPLATELINEORDER @psubject=:subject, " +
                                                      "@psource=:source, " +
                                                      "@pto=:to,  " +
                                                      "@pfromorder=:fromorder, " +
                                                      "@ptoorder=:toorder");
                query.SetString("subject", cli.Subject);
                query.SetString("source", cli.Source);
                query.SetInt64("to", cli.To);
                query.SetInt64("fromorder", cli.FromOrder);
                query.SetInt64("toorder", cli.ToOrder);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public void ReOrderChecklistItem(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REORDERUPDCHKLISTTEMPLATELINE @psubject=:subject, " +
                                                      "@psource=:source");

                query.SetString("subject", subject);
                query.SetString("source", source);
                query.ExecuteUpdate();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}