using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSUPPLIERINVOICELINEDETAILSVIEW_MAP : ClassMap<TMSUPPLIERINVOICELINEDETAILSVIEW>
    {
        public TMSUPPLIERINVOICELINEDETAILSVIEW_MAP()
        {
            Id(x => x.SIL_ID);
            Map(x => x.SIL_TYPE);
            Map(x => x.SIL_TASK);
            Map(x => x.SIL_ACTIVITY);
            Map(x => x.SIL_DATE);
            Map(x => x.SIL_DESC);
            Map(x => x.SIL_QTY);
            Map(x => x.SIL_UOM);
            Map(x => x.SIL_UNITPRICE);
            Map(x => x.SIL_TOTAL);
            Map(x => x.SIL_CURR);
        }
    }
}