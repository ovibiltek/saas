using NHibernate.Transform;
using NHibernate;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomerReport;
using Ovi.Task.Data.Entity.TaskDetailReport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;

namespace Ovi.Task.Data.Repositories
{
    public class TaskDetailParameters
    {
        public string Organization { get; set; }
        public string Department { get; set; }
        public DateTime? TaskCreatedStart { get; set; }
        public DateTime? TaskCreatedEnd { get; set; }
        public DateTime? TaskCompletedStart { get; set; }
        public DateTime? TaskCompletedEnd { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public string TaskType { get; set; }
        public string Customer { get; set; }
        public string CustomerGroup { get; set; }
        public string Branch { get; set; }
        public string Region { get; set; }
        public string Province { get; set; }
        public string Supplier { get; set; }
        public string Status { get; set; }
        public int PassedDaysLimit { get; set; }
       
    }
    public class RepositoryTaskDetailReport
    {
        public IList<TM_RPTTASKDETAIL_SECTION1> ListSection1(TaskDetailParameters p)
        {
			try
			{
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION1 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department",p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION1))).List<TM_RPTTASKDETAIL_SECTION1>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION1>();
                return lst;
            }
			catch (Exception e )
			{

				throw ExceptionHandler.Process(e);
			}
        }

        public IList<TM_RPTTASKDETAIL_SECTION2> ListSection2(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION2 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION2))).List<TM_RPTTASKDETAIL_SECTION2>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION2>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }
        public IList<TM_RPTTASKDETAIL_SECTION3> ListSection3(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION3 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION3))).List<TM_RPTTASKDETAIL_SECTION3>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION3>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTTASKDETAIL_SECTION4> ListSection4(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION4 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION4))).List<TM_RPTTASKDETAIL_SECTION4>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION4>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_REGIONAL_RPTTASKDETAIL_SECTION4> ListRegionalSection4(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REGIONAL_RPTTASKDETAIL_SECTION4 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_REGIONAL_RPTTASKDETAIL_SECTION4))).List<TM_REGIONAL_RPTTASKDETAIL_SECTION4>();
                session.EvictAll<TM_REGIONAL_RPTTASKDETAIL_SECTION4>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }


        public IList<TM_RPTTASKDETAIL_SECTION5> ListSection5(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION5 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION5))).List<TM_RPTTASKDETAIL_SECTION5>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION5>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }
        public IList<TM_REGIONAL_RPTTASKDETAIL_SECTION5> ListRegionalSection5(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REGIONAL_RPTTASKDETAIL_SECTION5 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_REGIONAL_RPTTASKDETAIL_SECTION5))).List<TM_REGIONAL_RPTTASKDETAIL_SECTION5>();
                session.EvictAll<TM_REGIONAL_RPTTASKDETAIL_SECTION5>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTTASKDETAIL_SECTION6> ListSection6(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION6 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION6))).List<TM_RPTTASKDETAIL_SECTION6>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION6>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTTASKDETAIL_SECTION7> ListSection7(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION7 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status,@PPASSEDDAYSLIMIT=:passeddayslimit");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
              
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                query.SetInt32("passeddayslimit", p.PassedDaysLimit);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION7))).List<TM_RPTTASKDETAIL_SECTION7>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION7>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTTASKDETAIL_SECTION8> ListSection8(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION8 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION8))).List<TM_RPTTASKDETAIL_SECTION8>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION8>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        } 

        public IList<TM_RPTTASKDETAIL_SECTION9> ListSection9(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION9 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION9))).List<TM_RPTTASKDETAIL_SECTION9>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION9>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTTASKDETAIL_SECTION10> ListSection10(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION10 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PCATEGORY=:category,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("category", p.Category);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION10))).List<TM_RPTTASKDETAIL_SECTION10>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION10>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_REGIONAL_RPTTASKDETAIL_SECTION10> ListRegionalSection10(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REGIONAL_RPTTASKDETAIL_SECTION10 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PCATEGORY=:category,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("category", p.Category);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_REGIONAL_RPTTASKDETAIL_SECTION10))).List<TM_REGIONAL_RPTTASKDETAIL_SECTION10>();
                session.EvictAll<TM_REGIONAL_RPTTASKDETAIL_SECTION10>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTTASKDETAIL_SECTION11> ListSection11(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTTASKDETAIL_SECTION11 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTTASKDETAIL_SECTION11))).List<TM_RPTTASKDETAIL_SECTION11>();
                session.EvictAll<TM_RPTTASKDETAIL_SECTION11>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }
        public IList<TM_REGIONAL_RPTTASKDETAIL_SECTION11> ListRegionalSection11(TaskDetailParameters p)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_REGIONAL_RPTTASKDETAIL_SECTION11 @PORGANIZATION =:organization,@PDEPARTMENT=:department,@PTASKCREATEDSTART=:createdstart,@PTASKCREATEDEND=:createdend,@PTASKCOMPLETEDSTART=:completedstart,@PTASKCOMPLETEDEND=:completedend,@PTYPE=:type,@PCATEGORY=:category,@PTASKTYPE=:tasktype,@PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup,@PBRANCH=:branch,@PREGION=:region,@PPROVINCE=:province,@PSUPPLIER=:supplier,@PSTATUS=:status");
                query.SetString("organization", p.Organization);
                query.SetString("department", p.Department);
                query.SetDateTime("createdstart", p.TaskCreatedStart);
                query.SetDateTime("createdend", p.TaskCreatedEnd);
                query.SetDateTime("completedstart", p.TaskCompletedStart);
                query.SetDateTime("completedend", p.TaskCompletedEnd);
                query.SetString("type", p.Type);
                query.SetString("category", p.Category);
                query.SetString("tasktype", p.TaskType);
                query.SetString("customer", p.Customer);
                query.SetString("customergroup", p.CustomerGroup);
                query.SetString("branch", p.Branch);
                query.SetString("region", p.Region);
                query.SetString("status", p.Status);
                query.SetString("province", p.Province);
                query.SetString("supplier", p.Supplier);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_REGIONAL_RPTTASKDETAIL_SECTION11))).List<TM_REGIONAL_RPTTASKDETAIL_SECTION11>();
                session.EvictAll<TM_REGIONAL_RPTTASKDETAIL_SECTION11>();
                return lst;
            }
            catch (Exception e)
            {

                throw ExceptionHandler.Process(e);
            }
        }

    }
}
