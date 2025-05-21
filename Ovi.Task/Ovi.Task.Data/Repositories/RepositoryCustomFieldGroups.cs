using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomFieldGroups : BaseRepository<TMCUSTOMFIELDGROUPS, string>
    {
        public IList<TMCUSTOMFIELDGROUPS> ListByCodes(object[] codes)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCUSTOMFIELDGROUPS>()
                    .Where(x => x.CFG_ACTIVE == '+')
                    .AndRestrictionOn(x => x.CFG_CODE).IsIn(codes).List();
                session.EvictAll<TMCUSTOMFIELDGROUPS>();
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
                repositoryDescriptions.DeleteDescriptions("TMCUSTOMFIELDGROUPS", "CFG_DESC", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}