using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Abstract;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.DAO;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using Ovi.Task.Data.Helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Ovi.Task.Helper.Functional;
using System.Linq;

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryUsers : BaseRepository<TMUSERS, string>
    {
        public IList<TMUSERSVIEW> ListView(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return CriteriaHelper<TMUSERSVIEW>.Run(session, krg);
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMUSERSVIEW> ListByDepartment(string department)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                return session.QueryOver<TMUSERSVIEW>()
                    .Where(x => x.USR_DEPARTMENT == department)
                    .And(x => x.USR_ACTIVE == "+")
                    .List<TMUSERSVIEW>();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public long Count(GridRequest krg)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMUSERSVIEW>();
                var criteria = CriteriaHelper<TMUSERSVIEW>.Build(session, krg);
                return criteria.UniqueResult().GetHashCode();
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMUSERS Get(string username, string password)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var l = session.QueryOver<TMUSERS>()
                    .Where(x => x.USR_CODE == username)
                    .And(x => x.USR_PASSWORD == password)
                    .FutureValue<TMUSERS>().Value;
                session.EvictAll<TMUSERS>();
                return l;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public TMUSERS GetUserByEMail(string email)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                var user = session.QueryOver<TMUSERS>()
                    .Where(x => x.USR_EMAIL == email)
                    .Take(1)
                    .SingleOrDefault();
                session.EvictAll<TMUSERS>();
                return user;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }


        public override TMUSERS SaveOrUpdate(TMUSERS p, bool updateOnlyRecord)
        {
            try
            {
                var isnewrecord = p.USR_SQLIDENTITY == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                session.SaveOrUpdateAndEvict(p, p.USR_SQLIDENTITY == 0);

                if (!updateOnlyRecord)
                {

                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'USER' " +
                                                            "AND fm.FMP_FIELD = 'AUTHORIZEDDEPARTMENT' " +
                                                            "AND fm.FMP_CODE = ?", p.USR_CODE, NHibernateUtil.String);

                    if (p.USR_AUTHORIZEDDEPARTMENTS != null && p.USR_AUTHORIZEDDEPARTMENTS != "*")
                    {
                        foreach (var aud in p.USR_AUTHORIZEDDEPARTMENTS.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "USER",
                                FMP_FIELD = "AUTHORIZEDDEPARTMENT",
                                FMP_VALUE = aud,
                                FMP_CODE = p.USR_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }

                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'USER' " +
                                                "AND fm.FMP_FIELD = 'SUPPLIER' " +
                                                "AND fm.FMP_CODE = ?",
                        p.USR_CODE, NHibernateUtil.String);
                    if (p.USR_SUPPLIER != null && p.USR_SUPPLIER != "*")
                    {
                        foreach (var sup in p.USR_SUPPLIER.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "USER",
                                FMP_FIELD = "SUPPLIER",
                                FMP_VALUE = sup,
                                FMP_CODE = p.USR_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }

                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'USER' " +
                        "AND fm.FMP_FIELD = 'CUSTOMER' " +
                        "AND fm.FMP_CODE = ?",
                        p.USR_CODE, NHibernateUtil.String);


                    if (p.USR_CUSTOMER != null && p.USR_CUSTOMER != "*")
                    {
                        foreach (var cus in p.USR_CUSTOMER.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "USER",
                                FMP_FIELD = "CUSTOMER",
                                FMP_VALUE = cus,
                                FMP_CODE = p.USR_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = ContextUserHelper.Instance.ContextUser.Code,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }
                }
                
                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TMUSEREXT> GetUsers(string users)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                session.EvictAll<TMUSEREXT>();
                if (!string.IsNullOrEmpty(users))
                {
                    IQuery query = session.CreateSQLQuery(string.Format("SELECT * FROM [dbo].[FNC_GETUSERS]('{0}')", users));
                    return query.SetResultTransformer(Transformers.AliasToBean(typeof(TMUSEREXT))).List<TMUSEREXT>();
                }
                return null;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public bool SystemCheck()
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IDbCommand command = new SqlCommand { CommandType = CommandType.StoredProcedure, CommandText = "TM_SYSTEMCHECK" };

                command.Connection = session.Connection;
                command.Parameters.Add(new SqlParameter("@CHKRET", SqlDbType.Char, 1) { Direction = ParameterDirection.Output });

                if (session.Transaction.IsActive)
                {
                    session.Transaction.Enlist(command);
                }

                command.ExecuteNonQuery();

                var packvar = ((SqlParameter)command.Parameters["@CHKRET"]).Value;
                return (string)packvar == "+";
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<ErrLine> Save(List<UserModel> lstofusers, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            for (int i = 0; i < lstofusers.Count; i++)
            {
                UserModel usr = lstofusers[i];
                try
                {
                    var isnewrecord = usr.User.USR_SQLIDENTITY == 0;

                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    NHibernateSessionManager.Instance.GetSession().SaveOrUpdateAndEvict(usr.User, isnewrecord);

                    NHibernateSessionManager.Instance.GetSession().DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'USER' AND fm.FMP_FIELD = 'AUTHORIZEDDEPARTMENT' AND fm.FMP_CODE = ?", usr.User.USR_CODE, NHibernateUtil.String);
                    if (usr.User.USR_AUTHORIZEDDEPARTMENTS != null && usr.User.USR_AUTHORIZEDDEPARTMENTS != "*")
                    {
                        foreach (var aud in usr.User.USR_AUTHORIZEDDEPARTMENTS.Split(','))
                        {
                            NHibernateSessionManager.Instance.GetSession().Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "USER",
                                FMP_FIELD = "AUTHORIZEDDEPARTMENT",
                                FMP_VALUE = aud,
                                FMP_CODE = usr.User.USR_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? usr.User.USR_CREATEDBY : usr.User.USR_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }

                    NHibernateSessionManager.Instance.GetSession().DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'USER' AND fm.FMP_FIELD = 'SUPPLIER' AND fm.FMP_CODE = ?",
                        usr.User.USR_CODE, NHibernateUtil.String);
                    if (usr.User.USR_SUPPLIER != null && usr.User.USR_SUPPLIER != "*")
                    {
                        foreach (var sup in usr.User.USR_SUPPLIER.Split(','))
                        {
                            NHibernateSessionManager.Instance.GetSession().Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "USER",
                                FMP_FIELD = "SUPPLIER",
                                FMP_VALUE = sup,
                                FMP_CODE = usr.User.USR_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? usr.User.USR_CREATEDBY : usr.User.USR_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }

                    NHibernateSessionManager.Instance.GetSession().DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'USER' AND fm.FMP_FIELD = 'CUSTOMER' AND fm.FMP_CODE = ?",
                        usr.User.USR_CODE, NHibernateUtil.String);
                    if (usr.User.USR_CUSTOMER != null && usr.User.USR_CUSTOMER != "*")
                    {
                        foreach (var cus in usr.User.USR_CUSTOMER.Split(','))
                        {
                            NHibernateSessionManager.Instance.GetSession().Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "USER",
                                FMP_FIELD = "CUSTOMER",
                                FMP_VALUE = cus,
                                FMP_CODE = usr.User.USR_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? usr.User.USR_CREATEDBY : usr.User.USR_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }

                    if (usr.CustomFieldValues.Length > 0)
                        new RepositoryCustomFieldValues().Save("USER", usr.User.USR_CODE, usr.CustomFieldValues);


                    NHibernateSessionManager.Instance.CommitTransaction();
                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = usr.Values,
                        ErrMsg = exc.Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofusers.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }

            return errorList;
        }
    }
}