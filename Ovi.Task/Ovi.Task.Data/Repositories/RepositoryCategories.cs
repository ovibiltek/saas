using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCategories : BaseRepository<TMCATEGORIES, string>
    {

        public IList<TMCATEGORYEXT> GetCategories(string categories)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMCATEGORYEXT>();
                IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETCATEGORIES]('{0}')", categories));
                return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMCATEGORYEXT))).List<TMCATEGORYEXT>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
        public IList<TMDEPARTMENTCATEGORIESVIEW> ListByDepartment(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMDEPARTMENTCATEGORIESVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}