using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONLINESVIEW_MAP : ClassMap<TMQUOTATIONLINESVIEW>
    {
        public TMQUOTATIONLINESVIEW_MAP()
        {
            CompositeId().KeyProperty(x => x.QLN_QUOTATION).KeyProperty(x => x.QLN_NO);
            Map(x => x.QLN_LINEID);
            Map(x => x.QLN_SERVICECODE);
            Map(x => x.QLN_PARTCODE);
            Map(x => x.QLN_QUOEXCH);
            Map(x => x.QLN_TYPE);
            Map(x => x.QLN_SUBTYPE);
            Map(x => x.QLN_DESCRIPTION);
            Map(x => x.QLN_BRAND);
            Map(x => x.QLN_ORGANIZATION);
            Map(x => x.QLN_SUPPLIER);
            Map(x => x.QLN_UOM);
            Map(x => x.QLN_QUANTITY);
            Map(x => x.QLN_UNITPURCHASEPRICE);
            Map(x => x.QLN_PURCHASECURR);
            Map(x => x.QLN_PURCHASECURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', QLN_PURCHASECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = QLN_PURCHASECURR), :SessionContext.Language)");
            Map(x => x.QLN_UNITSALESPRICE);
            Map(x => x.QLN_UNITPRICE);
            Map(x => x.QLN_TOTALPRICE);
            Map(x => x.QLN_PURCHASEEXCH);
            Map(x => x.QLN_EXCH);
            Map(x => x.QLN_CURR);
            Map(x => x.QLN_CURRDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', QLN_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = QLN_CURR), :SessionContext.Language)");
            Map(x => x.QLN_SALESDISCOUNTRATE);
            Map(x => x.QLN_RECORDVERSION);
            Map(x => x.QLN_REFERENCE);
            Map(x => x.QLN_COPY);

        }
    }
}