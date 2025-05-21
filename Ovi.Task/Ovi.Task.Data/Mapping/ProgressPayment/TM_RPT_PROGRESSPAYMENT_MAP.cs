using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TM_RPT_PROGRESSPAYMENT_MAP : ClassMap<TM_RPT_PROGRESSPAYMENT>
    {
        public TM_RPT_PROGRESSPAYMENT_MAP()
        {
            Id(x => x.RPP_ID);
            Map(x => x.RPP_PSP);
            Map(x => x.RPP_TSK);
            Map(x => x.RPP_TSKDESC);
            Map(x => x.RPP_TSKTYPE);
            Map(x => x.RPP_TSKTYPEDESC);
            Map(x => x.RPP_TSKTASKTYPE);
            Map(x => x.RPP_TSKCATEGORY);
            Map(x => x.RPP_TSKCATDESC);
            Map(x => x.RPP_PSPSTATUS);
            Map(x => x.RPP_PSPSTATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'PROGRESSPAYMENT#' + RPP_PSPSTATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = RPP_PSPSTATUS AND s.STA_ENTITY = 'PROGRESSPAYMENT'),:SessionContext.Language)");
            Map(x => x.RPP_BRNAUTHORIZED);
            Map(x => x.RPP_BRNTYPE);
            Map(x => x.RPP_TSKCOMPLETED);
            Map(x => x.RPP_TSKREQUESTED);
            Map(x => x.RPP_PSPCREATED);
            Map(x => x.RPP_TSKCUSTOMER);
            Map(x => x.RPP_TSKCUSTOMERDESC);
            Map(x => x.RPP_TSKBRANCH);
            Map(x => x.RPP_TSKBRANCHDESC);
            Map(x => x.RPP_TSKBRANCHREFERENCE);
            Map(x => x.RPP_TSKTOTAL);
            Map(x => x.RPP_NOTE).Length(PropertySettings.L4001);
            Map(x => x.RPP_TSKREFERENCE);
            Map(x => x.RPP_PSPINVOICENO);
            Map(x => x.RPP_PSPGROUP);
            Map(x => x.RPP_PSPINVOICEDATE);
            Map(x => x.RPP_TSKDURATIONSTR);
            Map(x => x.RPP_TSKHOLDDURATIONSTR);
            Map(x => x.RPP_HASQUOTATION);
            Map(x => x.RPP_SHFTIP);
            Map(x => x.RPP_SHHYIL);
            Map(x => x.RPP_SHHAY);
            Map(x => x.RPP_SHFTIP_DESC);
            Map(x => x.RPP_SHHYIL_DESC);
            Map(x => x.RPP_SHHAY_DESC);
        }
    }
}