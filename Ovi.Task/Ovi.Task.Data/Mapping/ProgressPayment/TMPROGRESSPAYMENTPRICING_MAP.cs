using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TMPROGRESSPAYMENTPRICING_MAP : ClassMap<TMPROGRESSPAYMENTPRICING>
    {
        public TMPROGRESSPAYMENTPRICING_MAP()
        {
            Id(x => x.PRC_ID);
            Map(x => x.PRC_PSPCODE);
            Map(x => x.PRC_TASK);
            Map(x => x.PRC_TASKDESC).ReadOnly().Formula("(SELECT t.TSK_SHORTDESC FROM TMTASKS t WHERE t.TSK_ID = PRC_TASK)");
            Map(x => x.PRC_BRANCH).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMTASKS t, TMBRANCHES b WHERE t.TSK_ID = PRC_TASK AND b.BRN_CODE = t.TSK_BRANCH)");
            Map(x => x.PRC_CUSTOMER).ReadOnly().Formula("(SELECT c.CUS_DESC FROM TMTASKS t, TMCUSTOMERS c WHERE t.TSK_ID = PRC_TASK AND c.CUS_CODE = t.TSK_CUSTOMER)");
            Map(x => x.PRC_ACTLINE);
            Map(x => x.PRC_ACTTRADE).ReadOnly().Formula("(SELECT trd.TRD_DESC FROM TMTASKACTIVITIES tsa, TMTRADES trd WHERE tsa.TSA_TASK = PRC_TASK AND tsa.TSA_LINE = PRC_ACTLINE AND trd.TRD_CODE = tsa.TSA_TRADE)");
            Map(x => x.PRC_ACTDESC).ReadOnly().Formula("(SELECT tsa.TSA_DESC FROM TMTASKACTIVITIES tsa WHERE tsa.TSA_TASK = PRC_TASK AND tsa.TSA_LINE = PRC_ACTLINE)");
            Map(x => x.PRC_CODE);
            Map(x => x.PRC_TYPE);
            Map(x => x.PRC_TYPEDESC);
            Map(x => x.PRC_QTY);
            Map(x => x.PRC_USERQTY);
            Map(x => x.PRC_UOM);
            Map(x => x.PRC_COST);
            Map(x => x.PRC_CALCMETHOD);
            Map(x => x.PRC_UNITPRICE);
            Map(x => x.PRC_USERUNITPRICE);
            Map(x => x.PRC_CALCPRICE).ReadOnly().Formula("(PRC_UNITPRICE + ISNULL(PRC_USERUNITPRICE,0))");
            Map(x => x.PRC_RETURNPRICE).ReadOnly().Formula("(SELECT s.SIR_RETURNTOTAL FROM TMSALESINVOICERETURNLINES s WHERE s.SIR_LINEID = PRC_ID)");
            Map(x => x.PRC_RETURNPRICEID).ReadOnly().Formula("(SELECT s.SIR_ID FROM TMSALESINVOICERETURNLINES s WHERE s.SIR_LINEID = PRC_ID)");
            Map(x => x.PRC_SALESINVOICE).ReadOnly().Formula("(SELECT s.PSP_SALESINVOICE FROM TMSALESINVOICELINESVIEW s WHERE s.PSP_CODE = PRC_PSPCODE)");
            Map(x => x.PRC_CREATED);
            Map(x => x.PRC_CREATEDBY);
            Map(x => x.PRC_RECORDVERSION);
            Map(x => x.PRC_TASKCMNTCOUNT).ReadOnly().Formula("(SELECT COUNT(*) FROM TMCOMMENTS c WHERE c.CMN_SOURCE = PRC_TASK AND c.CMN_SUBJECT = 'TASK' AND c.CMN_VISIBLETOCUSTOMER = CASE WHEN :SessionContext.Customer IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOCUSTOMER END " +
                                                                                                                                                         "AND c.CMN_VISIBLETOSUPPLIER = CASE WHEN :SessionContext.Supplier IS NOT NULL THEN '+' ELSE c.CMN_VISIBLETOSUPPLIER END)");
            Map(x => x.PRC_TASKDOCCOUNT).ReadOnly().Formula("dbo.GetDocumentCount('TASK', PRC_TASK, :SessionContext.User)");
            Map(x => x.PRC_CURR);
            Map(x => x.PRC_QUOTATION).ReadOnly().Formula("(SELECT TOP 1 q.QUO_ID FROM TMQUOTATIONSVIEW q WHERE q.QUO_STATUS <> 'IPT' AND ISNULL(q.QUO_TASK,0) = PRC_TASK AND ISNULL(q.QUO_ACTIVITY, PRC_ACTLINE) = PRC_ACTLINE)");
        }
    }
}