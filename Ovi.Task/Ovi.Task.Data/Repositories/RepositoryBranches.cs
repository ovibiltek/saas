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

namespace Ovi.Task.Data.Repositories
{
    public class RepositoryBranches : BaseRepository<TMBRANCHES, string>
    {
        public bool Save(List<TMBRANCHES> lstofbranches)
        {
            try
            {
                var repositoryCustomers = new RepositoryCustomers();
                var session = NHibernateSessionManager.Instance.GetSession();
                foreach (var pp in lstofbranches)
                {
                    var isnewrecord = pp.BRN_SQLIDENTITY == 0;
                    if (isnewrecord)
                    {
                        var customer = repositoryCustomers.Get(pp.BRN_CUSTOMER);
                        var newcodeid = customer.CUS_BRANCHCOUNT + 1;
                        var newcode = customer.CUS_BRANCHPREFIX + "." + pp.BRN_PROVINCE + "." + newcodeid.ToString().PadLeft(5, '0');

                        pp.BRN_CODE = newcode;
                        session.SaveOrUpdateAndEvict(pp, isnewrecord);
                        customer.CUS_BRANCHCOUNT = newcodeid;
                        session.SaveOrUpdate(customer);
                    }
                    else
                    {
                        session.SaveOrUpdateAndEvict(pp, isnewrecord);
                    }

                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'BRANCH' AND fm.FMP_FIELD = 'WARRANTY' AND fm.FMP_CODE = ?", pp.BRN_CODE, NHibernateUtil.String);
                    if (pp.BRN_WARRANTY != null && pp.BRN_WARRANTY != "*")
                    {
                        foreach (var warranty in pp.BRN_WARRANTY.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "BRANCH",
                                FMP_FIELD = "WARRANTY",
                                FMP_VALUE = warranty,
                                FMP_CODE = pp.BRN_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? pp.BRN_CREATEDBY : pp.BRN_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }
                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'BRANCH' AND fm.FMP_FIELD = 'AUTHORIZED' AND fm.FMP_CODE = ?", pp.BRN_CODE, NHibernateUtil.String);
                    if (pp.BRN_AUTHORIZED != null && pp.BRN_AUTHORIZED != "*")
                    {
                        foreach (var authorized in pp.BRN_AUTHORIZED.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "BRANCH",
                                FMP_FIELD = "AUTHORIZED",
                                FMP_VALUE = authorized,
                                FMP_CODE = pp.BRN_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? pp.BRN_CREATEDBY : pp.BRN_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public List<ErrLine> Save(List<BranchModel> lstofbranches, TMBATCHPROGRESSDATA batchProgress)
        {
            var batchProgressDataHelper = new BatchProgressDataHelper();
            var errorList = new List<ErrLine>();
            var repositoryCustomers = new RepositoryCustomers();
            for (var i = 0; i < lstofbranches.Count; i++)
            {
                var pp = lstofbranches[i];
                try
                {
                    var session = NHibernateSessionManager.Instance.GetSession();
                    NHibernateSessionManager.Instance.BeginTransaction(IsolationLevel.ReadCommitted);
                    var isnewrecord = pp.Branch.BRN_SQLIDENTITY == 0;
                    if (isnewrecord)
                    {
                        var customer = repositoryCustomers.Get(pp.Branch.BRN_CUSTOMER);
                        var newcodeid = customer.CUS_BRANCHCOUNT + 1;
                        var newcode = customer.CUS_BRANCHPREFIX + "." + pp.Branch.BRN_PROVINCE + "." + newcodeid.ToString().PadLeft(5,'0');

                        pp.Branch.BRN_CODE = newcode;
                        session.SaveOrUpdateAndEvict(pp.Branch, isnewrecord);
                        customer.CUS_BRANCHCOUNT = newcodeid;
                        session.SaveOrUpdate(customer);
                    }
                    else
                    {
                        session.SaveOrUpdateAndEvict(pp.Branch, isnewrecord);
                    }

                   
                    
                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'BRANCH' AND fm.FMP_FIELD = 'WARRANTY' AND fm.FMP_CODE = ?", pp.Branch.BRN_CODE, NHibernateUtil.String);
                    if (pp.Branch.BRN_WARRANTY != null && pp.Branch.BRN_WARRANTY != "*")
                    {
                        foreach (var warranty in pp.Branch.BRN_WARRANTY.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "BRANCH",
                                FMP_FIELD = "WARRANTY",
                                FMP_VALUE = warranty,
                                FMP_CODE = pp.Branch.BRN_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? pp.Branch.BRN_CREATEDBY : pp.Branch.BRN_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }
                    session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'BRANCH' AND fm.FMP_FIELD = 'AUTHORIZED' AND fm.FMP_CODE = ?", pp.Branch.BRN_CODE, NHibernateUtil.String);
                    if (pp.Branch.BRN_AUTHORIZED != null && pp.Branch.BRN_AUTHORIZED != "*")
                    {
                        foreach (var authorized in pp.Branch.BRN_AUTHORIZED.Split(','))
                        {
                            session.Save(new TMFIELDMAPS
                            {
                                FMP_ENTITY = "BRANCH",
                                FMP_FIELD = "AUTHORIZED",
                                FMP_VALUE = authorized,
                                FMP_CODE = pp.Branch.BRN_CODE,
                                FMP_CREATED = DateTime.Now,
                                FMP_CREATEDBY = isnewrecord ? pp.Branch.BRN_CREATEDBY : pp.Branch.BRN_UPDATEDBY,
                                FMP_RECORDVERSION = 0
                            });
                        }
                    }
                    NHibernateSessionManager.Instance.CommitTransaction();

                }
                catch (Exception exc)
                {
                    NHibernateSessionManager.Instance.RollbackTransaction();
                    errorList.Add(new ErrLine
                    {
                        Values = pp.Values,
                        ErrMsg = ExceptionHandler.Process(exc).Message,
                        LineType = "LINE"
                    });
                }
                finally
                {
                    batchProgress.PRG_PROGRESSDATA = string.Format("{0} / {1}", (i + 1).ToString(), lstofbranches.Count.ToString());
                    batchProgressDataHelper.UpdateBatchProgress(batchProgress);
                }
            }
            return errorList;
        }

        public override TMBRANCHES SaveOrUpdate(TMBRANCHES p)
        {
            try
            {
                var repositoryCustomers = new RepositoryCustomers();

                var isnewrecord = p.BRN_SQLIDENTITY == 0;
                var session = NHibernateSessionManager.Instance.GetSession();
                if (isnewrecord)
                {
                    var customer = repositoryCustomers.Get(p.BRN_CUSTOMER);
                    var newcodeid = customer.CUS_BRANCHCOUNT + 1;
                    var newcode = customer.CUS_BRANCHPREFIX + "." + p.BRN_PROVINCE + "." + newcodeid.ToString().PadLeft(5, '0');
                    p.BRN_CODE = newcode;
                    customer.CUS_BRANCHCOUNT = newcodeid;
                    session.SaveOrUpdateAndEvict(p, p.BRN_SQLIDENTITY == 0);
                    session.SaveOrUpdate(customer);


                }
                else
                {
                    session.SaveOrUpdateAndEvict(p, p.BRN_SQLIDENTITY == 0);
                }

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'BRANCH' AND fm.FMP_FIELD = 'WARRANTY' AND fm.FMP_CODE = ?", p.BRN_CODE, NHibernateUtil.String);
                if (p.BRN_WARRANTY != null && p.BRN_WARRANTY != "*")
                {
                    foreach (var warranty in p.BRN_WARRANTY.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "BRANCH",
                            FMP_FIELD = "WARRANTY",
                            FMP_VALUE = warranty,
                            FMP_CODE = p.BRN_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.BRN_CREATEDBY : p.BRN_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                    }
                }

                session.DeleteAndFlush("FROM TMFIELDMAPS fm WHERE fm.FMP_ENTITY = 'BRANCH' AND fm.FMP_FIELD = 'AUTHORIZED' AND fm.FMP_CODE = ?", p.BRN_CODE, NHibernateUtil.String);
                if (p.BRN_AUTHORIZED != null)
                {
                    foreach (var value in p.BRN_AUTHORIZED.Split(','))
                    {
                        session.Save(new TMFIELDMAPS
                        {
                            FMP_ENTITY = "BRANCH",
                            FMP_FIELD = "AUTHORIZED",
                            FMP_VALUE = value,
                            FMP_CODE = p.BRN_CODE,
                            FMP_CREATED = DateTime.Now,
                            FMP_CREATEDBY = isnewrecord ? p.BRN_CREATEDBY : p.BRN_UPDATEDBY,
                            FMP_RECORDVERSION = 0
                        });
                    }
                }

                return p;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<BranchTaskCounts> ListBranchTaskCounts (string customer,DateTime? createdStart,DateTime? createdEnd)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPT_BRANCHTASKCOUNTS  @CUSTOMER=:customer,@CREATEDSTART=:createdstart,@CREATEDEND=:createdend");
                query.SetString("customer", customer);
                query.SetDateTime("createdstart",createdStart);
                query.SetDateTime("createdend",createdEnd);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(BranchTaskCounts))).List<BranchTaskCounts>();
                return lst;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public IList<MigrosBranchOrder> GetMigrosBranchOrders()
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("SELECT * FROM TMMIGROSBRANCHORDER");
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(MigrosBranchOrder))).List<MigrosBranchOrder>();
                return lst;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }
}