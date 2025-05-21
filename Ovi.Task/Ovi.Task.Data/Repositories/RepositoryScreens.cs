using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryScreens : BaseRepository<TMSCREENS, string>
    {
        public TMSCREENS GetByController(string controller)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMSCREENS>()
                    .Where(x => x.SCR_CONTROLLER == controller)
                    .FutureValue<TMSCREENS>().Value;
                session.EvictAll<TMSCREENS>();
                return l;
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
                repositoryDescriptions.DeleteDescriptions("TMSCREENS", "SCR_DESC", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMSCREENS GetByClass(string classname)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMSCREENS>()
                    .Where(x => x.SCR_CLASS == classname)
                    .FutureValue<TMSCREENS>().Value;
                session.EvictAll<TMSCREENS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}