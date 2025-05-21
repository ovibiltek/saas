using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryMailTemplates : BaseRepository<TMMAILTEMPLATES, long>
    {
        public TMMAILTEMPLATES GetByTemplateId(int templateid)
        {
            try
            {
                var session = NHibernateSessionManagerMcdb.Instance.GetSession();
                var mt = session.QueryOver<TMMAILTEMPLATES>()
                    .Where(x => x.TMP_TMPID == templateid)
                    .FutureValue().Value;
                session.Evict(mt);
                return mt;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}