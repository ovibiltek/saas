using NHibernate;
using NHibernate.Type;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomFields;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryCustomFieldValues : BaseRepository<TMCUSTOMFIELDVALUES, long>
    {
        public IList<TMCUSTOMFIELDVALUES> GetBySubjectAndSource(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMCUSTOMFIELDVALUES>().Where(x => x.CFV_SOURCE == source)
                    .And(x => x.CFV_SUBJECT == subject)
                    .List();
                session.EvictAll<TMCUSTOMFIELDVALUES>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMCUSTOMFIELDVALUES> GetBySubjectAndSource(string subject, string[] source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var arrSize = 1000;
                List<TMCUSTOMFIELDVALUES> cfvList = new List<TMCUSTOMFIELDVALUES>();

                if (source.Length > arrSize)
                {
                    var splittedTaskArr = source.Split(arrSize);
                    foreach (var arr in splittedTaskArr)
                    {
                        var l = session.QueryOver<TMCUSTOMFIELDVALUES>()
                            .Where(x => x.CFV_SUBJECT == subject)
                            .AndRestrictionOn(x => x.CFV_SOURCE).IsIn(arr.ToArray())
                            .List();
                        cfvList.AddRange(l);

                    }
                }
                else
                {
                    var l = session.QueryOver<TMCUSTOMFIELDVALUES>()
                        .Where(x => x.CFV_SUBJECT == subject)
                        .AndRestrictionOn(x => x.CFV_SOURCE).IsIn(source)
                        .List();
                    cfvList.AddRange(l);
                }

                session.EvictAll<TMCUSTOMFIELDVALUES>();
                return (cfvList.Count > 0 ? cfvList : null);


            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool Save(string subject, string source, TMCUSTOMFIELDVALUES[] p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var cf in p)
                {
                    var cfv = Get(cf.CFV_ID);
                    switch (cfv)
                    {
                        case null:
                            cf.CFV_CREATED = DateTime.Now;
                            cf.CFV_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code;
                            if (!string.IsNullOrEmpty(cf.CFV_TEXT) || cf.CFV_NUM.HasValue || cf.CFV_DATETIME.HasValue)
                            {
                                cf.CFV_SOURCE = source;
                                session.SaveOrUpdateAndEvict(cf);
                            }
                            break;
                        default:
                            if (cfv.CFV_TEXT != cf.CFV_TEXT || cfv.CFV_NUM != cf.CFV_NUM || cfv.CFV_DATETIME != cf.CFV_DATETIME)
                            {
                                if (string.IsNullOrEmpty(cf.CFV_TEXT) && !cf.CFV_NUM.HasValue && !cf.CFV_DATETIME.HasValue)
                                {
                                    session.DeleteAndFlush("FROM TMCUSTOMFIELDVALUES cfv WHERE cfv.CFV_ID = ?", new object[] { cf.CFV_ID }, new IType[] { NHibernateUtil.Int64 });
                                }
                                else if (!string.IsNullOrEmpty(cf.CFV_TEXT) || cf.CFV_NUM.HasValue || cf.CFV_DATETIME.HasValue)
                                {
                                    cf.CFV_CREATED = cfv.CFV_CREATED;
                                    cf.CFV_CREATEDBY = cfv.CFV_CREATEDBY;
                                    cf.CFV_UPDATED = DateTime.Now;
                                    cf.CFV_UPDATEDBY = ContextUserHelper.Instance.ContextUser.Code;
                                    session.SaveOrUpdateAndEvict(cf);
                                }
                            }
                            break;
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool DeleteBySubjectAndSource(string subject, string source)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.DeleteAndFlush("FROM TMCUSTOMFIELDVALUES cfv WHERE cfv.CFV_SUBJECT = ? AND cfv.CFV_SOURCE = ?", new object[] { subject, source }, new IType[] { NHibernateUtil.String, NHibernateUtil.String });
                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}