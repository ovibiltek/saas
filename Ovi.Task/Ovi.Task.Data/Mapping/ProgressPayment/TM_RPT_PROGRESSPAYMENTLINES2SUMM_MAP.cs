using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TM_RPT_PROGRESSPAYMENTLINES2SUMM_MAP : ClassMap<TM_RPT_PROGRESSPAYMENTLINES2SUMM>
    {
        public TM_RPT_PROGRESSPAYMENTLINES2SUMM_MAP()
        {

            Id(x => x.PRC_ID);
            Map(x => x.PRC_TASK);
            Map(x => x.PRC_TSKREFERENCE);
            Map(x => x.PRC_TSKREQUESTED);
            Map(x => x.PRC_TSKCOMPLETED);
            Map(x => x.PRC_BRNREFERENCE);
            Map(x => x.PRC_BRNDESC);
            Map(x => x.PRC_TSKCATDESC);
            Map(x => x.PRC_TSKTYPEDESC);
            Map(x => x.PRC_TSKSHORTDESC);
            Map(x => x.PRC_SERVICEFEE);
            Map(x => x.PRC_PARTTOTAL);
            Map(x => x.PRC_CUSPM);
            Map(x => x.PRC_TOTAL);
            Map(x => x.PRC_VAT);
            Map(x => x.PRC_GRANDTOTAL);
        }

    }
}
