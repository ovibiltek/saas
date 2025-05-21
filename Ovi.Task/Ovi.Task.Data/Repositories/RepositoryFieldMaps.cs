using NHibernate;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using System;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryFieldMaps : BaseRepository<TMFIELDMAPS, long>
    {
        public void SaveList(FieldMapsModel fmap)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = ? AND fm.FMP_FIELD = ? AND fm.FMP_CODE = ?", new[] { fmap.Entity, fmap.Field, fmap.Code }, new[] { NHibernateUtil.String, NHibernateUtil.String, NHibernateUtil.String });
                foreach (var line in fmap.Lines)
                {
                    session.Save(line);
                }
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}