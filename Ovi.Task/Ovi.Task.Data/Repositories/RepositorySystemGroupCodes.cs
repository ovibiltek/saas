using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositorySystemGroupCodes : BaseRepository<TMSYSTEMGROUPCODES, string>
    {
        public override bool DeleteById(string id)
        {
            try
            {
                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMSYSTEMGROUPCODES", "SYC_DESCRIPTION", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}