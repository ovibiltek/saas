using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryActions : BaseRepository<TMACTIONS, string>
    {
        public override bool DeleteById(string id)
        {
            try
            {
                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMACTIONS", "ACT_DESC", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}