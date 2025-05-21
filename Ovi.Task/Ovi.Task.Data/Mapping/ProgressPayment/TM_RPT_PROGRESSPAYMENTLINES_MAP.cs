using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TM_RPT_PROGRESSPAYMENTLINES_MAP : ClassMap<TM_RPT_PROGRESSPAYMENTLINES>
    {
        public TM_RPT_PROGRESSPAYMENTLINES_MAP()
        {
            Id(x => x.PRC_ID);
            Map(x => x.PRC_TASK);
            Map(x => x.PRC_UNITPRICE);
            Map(x => x.PRC_UOM);
            Map(x => x.PRC_QTY);
            Map(x => x.PRC_TYPE);
            Map(x => x.PRC_SUBTYPE);
            Map(x => x.PRC_TYPEDESC);
        }
    }
}