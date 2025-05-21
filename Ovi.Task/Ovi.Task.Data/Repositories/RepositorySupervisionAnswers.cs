using System;
using System.Collections.Generic;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Supervision;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySupervisionAnswers : BaseRepository<TMSUPERVISIONANSWERS, long>
    {
        public IList<TMSUPERVISIONANSWERS> ListByQuestions(long[] questions)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMSUPERVISIONANSWERS>()
                    .WhereRestrictionOn(x => x.SVA_QUESTION)
                    .IsIn(questions)
                    .List();
                session.EvictAll<TMSUPERVISIONANSWERS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}
