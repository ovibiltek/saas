using NHibernate;
using NHibernate.Criterion;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryDepartmentCategories : BaseRepository<TMDEPARTMENTCATEGORIES, long>
    {
        public bool Save(string department, TMDEPARTMENTCATEGORIES[] departmentCategories)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMDEPARTMENTCATEGORIES dc WHERE dc.DCT_DEPARTMENT = ?", department, NHibernateUtil.String);
                foreach (var t in departmentCategories)
                {
                    session.SaveOrUpdateAndEvict(t);
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMDEPARTMENTCATEGORIES> GetByDepartment(string[] departments)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var lstugh = session.QueryOver<TMDEPARTMENTCATEGORIES>().Where(x => x.DCT_DEPARTMENT.IsIn(departments)).List();
                session.EvictAll<TMDEPARTMENTCATEGORIES>();
                return lstugh;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}