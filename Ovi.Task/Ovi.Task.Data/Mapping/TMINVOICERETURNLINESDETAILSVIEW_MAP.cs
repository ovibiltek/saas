using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMINVOICERETURNLINESDETAILSVIEW_MAP : ClassMap<TMINVOICERETURNLINESDETAILSVIEW>
    {
        public TMINVOICERETURNLINESDETAILSVIEW_MAP()
        {
            Id(x => x.SIL_ID);
            Map(x => x.SIL_IRLID);
            Map(x => x.SIL_IRLINVOICECODE);
            Map(x => x.SIL_DETAILID);
            Map(x => x.SIL_INVOICENO);
            Map(x => x.SIL_TYPE);
            Map(x => x.SIL_TASK);
            Map(x => x.SIL_ACTIVITY);
            Map(x => x.SIL_DATE);
            Map(x => x.SIL_DESC);
            Map(x => x.SIL_QTY);
            Map(x => x.SIL_UOM);
            Map(x => x.SIL_UNITPRICE);
            Map(x => x.SIL_ALREADYRETURNED);
            Map(x => x.SIL_TOTAL);
            Map(x => x.SIL_CURR);
            Map(x => x.SIL_INVOICE);
            Map(x => x.SIL_INVOICESTATUS);
        }
    }
}