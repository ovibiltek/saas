using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomFieldAuth : BaseRepository<TMCUSTOMFIELDAUTH, TMCUSTOMFIELDAUTH>
    {
        public IList<TMCUSTOMFIELDAUTHVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMCUSTOMFIELDAUTHVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SaveList(TMCUSTOMFIELDAUTH[] p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var r in p)
                {
                    var o = session.GetAndEvict<TMCUSTOMFIELDAUTH>(new TMCUSTOMFIELDAUTH
                    {
                        CFA_CODE = r.CFA_CODE,
                        CFA_TYPE = r.CFA_TYPE,
                        CFA_GROUP = r.CFA_GROUP
                    });

                    session.Evict(o);

                    if (o != null)
                    {
                        r.CFA_CREATED = o.CFA_CREATED;
                        r.CFA_CREATEDBY = o.CFA_CREATEDBY;
                        r.CFA_UPDATED = r.CFA_CREATED;
                        r.CFA_UPDATEDBY = r.CFA_CREATEDBY;
                    }

                    if (r.CFA_OPTIONAL == '-' && r.CFA_REQUIRED == '-' && r.CFA_PROTECTED == '-')
                    {
                        session.Delete(r);
                    }
                    else
                    {
                        session.SaveOrUpdateAndEvict(r);
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}