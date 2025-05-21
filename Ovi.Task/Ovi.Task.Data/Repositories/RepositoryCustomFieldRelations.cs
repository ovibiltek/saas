using System;
using System.Collections.Generic;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomFieldRelations : BaseRepository<TMCUSTOMFIELDRELATIONS, long>
    {
        public IList<TMCUSTOMFIELDRELATIONS> ListByEntity(string entity)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCUSTOMFIELDRELATIONS>()
                    .Where(x => x.CFR_ENTITY == entity)
                    .And(x => x.CFR_AUTH != 'H')
                    .List();
                session.EvictAll<TMCUSTOMFIELDRELATIONS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}