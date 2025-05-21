using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryStatuses : BaseRepository<TMSTATUSES, TMSTATUSES>
    {
        public override bool DeleteByEntity(TMSTATUSES s)
        {
            try
            {
                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMSTATUSES", "STA_DESC", string.Format("{0}#{1}", s.STA_ENTITY, s.STA_CODE));
                return base.DeleteByEntity(s);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}