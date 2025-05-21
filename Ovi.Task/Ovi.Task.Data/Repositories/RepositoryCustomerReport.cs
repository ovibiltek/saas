using NHibernate;
using NHibernate.Transform;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.CustomerReport;
using Ovi.Task.Data.Exceptions;
using Ovi.Task.Data.Extensions;
using System;
using System.Collections.Generic;
using System.Data;

namespace Ovi.Task.Data.Repositories
{
    public class CustomerReportParameters
    {
        public string Customer { get; set; }

        public string CustomerGroup { get; set; }

        public DateTime? TaskCompletedStart { get; set; }

        public DateTime? TaskCompletedEnd { get; set; }

        public char GetAll { get; set; }
    }

    public class CustomerEquipmentParameters
    {
        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string[] Categories { get; set; }
    }

    public class RepositoryCustomerReport
    {
        public IList<TM_RPTCUSTOMER_SECTION1> ListSection1(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION1 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION1))).List<TM_RPTCUSTOMER_SECTION1>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION1>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_SECTION2> ListSection2(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION2 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION2))).List<TM_RPTCUSTOMER_SECTION2>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION2>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_SECTION3> ListSection3(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION3 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend, @PGETALL=:getall");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetCharacter("getall", customerReportParameters.GetAll);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION3))).List<TM_RPTCUSTOMER_SECTION3>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION3>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_SECTION4> ListSection4(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION4 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend, @PGETALL=:getall");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetCharacter("getall", customerReportParameters.GetAll);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION4))).List<TM_RPTCUSTOMER_SECTION4>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION4>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_SECTION5> ListSection5(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION5 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend,@PGETALL=:getall");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetCharacter("getall", customerReportParameters.GetAll);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION5))).List<TM_RPTCUSTOMER_SECTION5>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION5>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_SECTION6> ListSection6(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION6 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION6))).List<TM_RPTCUSTOMER_SECTION6>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION6>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_SECTION7> ListSection7(CustomerReportParameters customerReportParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_SECTION7 @PCUSTOMER=:customer,@PCUSTOMERGROUP=:customergroup, @PTASKCOMPLETEDSTART=:completedstart, @PTASKCOMPLETEDEND=:completedend");
                query.SetString("customer", customerReportParameters.Customer);
                query.SetString("customergroup", customerReportParameters.CustomerGroup);
                query.SetDateTime("completedstart", customerReportParameters.TaskCompletedStart);
                query.SetDateTime("completedend", customerReportParameters.TaskCompletedEnd);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_SECTION7))).List<TM_RPTCUSTOMER_SECTION7>();
                session.EvictAll<TM_RPTCUSTOMER_SECTION7>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }

        public IList<TM_RPTCUSTOMER_EQUIPMENT_RESULT> ListCustomerEquipment(CustomerEquipmentParameters customerEquipmentParameters)
        {
            try
            {
                var session = NHibernateSessionManager.Instance.GetSession();
                IQuery query = session.CreateSQLQuery("EXEC TM_RPTCUSTOMER_EQUIPMENT @pStartDate=:startdate, @pEndDate=:enddate, @pCategories=:categories");

                var dtCategories = new DataTable();
                dtCategories.Columns.Add("CODE", typeof(string));
                foreach (var str in customerEquipmentParameters.Categories)
                {
                    var row = dtCategories.NewRow();
                    row["CODE"] = str;
                    dtCategories.Rows.Add(row);
                }

                query.SetDateTime("startdate", customerEquipmentParameters.StartDate);
                query.SetDateTime("enddate", customerEquipmentParameters.EndDate);
                query.SetStructured("categories", dtCategories);
                query.SetTimeout(0);
                var lst = query.SetResultTransformer(Transformers.AliasToBean(typeof(TM_RPTCUSTOMER_EQUIPMENT_RESULT))).List<TM_RPTCUSTOMER_EQUIPMENT_RESULT>();
                session.EvictAll<TM_RPTCUSTOMER_EQUIPMENT_RESULT>();
                return lst;
            }
            catch (Exception e)
            {
                throw ExceptionHandler.Process(e);
            }
        }
    }
}