using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomFields : BaseRepository<TMCUSTOMFIELDS, string>
    {
        public IList<TMCUSTOMFIELDS> ListByCodes(object[] codes)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCUSTOMFIELDS>()
                    .Where(x => x.CFD_ACTIVE == '+')
                    .AndRestrictionOn(x => x.CFD_CODE).IsIn(codes).List();
                session.EvictAll<TMCUSTOMFIELDS>();
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
                var delobj = new RepositoryCustomFields().Get(id);
                if (delobj.CFD_FIELDTYPE == "LOOKUP")
                {
                    new RepositoryLookupLines().DeleteByCode(id);
                }

                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMCUSTOMFIELDS", "CFD_DESC", id);
                return base.DeleteById(id);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}