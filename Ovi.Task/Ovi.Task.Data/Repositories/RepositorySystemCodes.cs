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
    public class RepositorySystemCodes : BaseRepository<TMSYSCODES, TMSYSCODES>
    {


        public override bool DeleteByEntity(TMSYSCODES syscode)
        {
            try
            {
                var repositoryDescriptions = new RepositoryDescriptions();
                repositoryDescriptions.DeleteDescriptions("TMSYSCODES", "SYC_DESCRIPTION", syscode.SYC_GROUP + "#" + syscode.SYC_CODE);
                return base.DeleteByEntity(syscode);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMSYSCODES> GetCodes(string group, string codes)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMSYSCODES>();
                IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETSYSCODES]('{0}','{1}')", group, codes));
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMSYSCODES))).List<TMSYSCODES>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}