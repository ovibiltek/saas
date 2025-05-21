using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONLINEHISTORY_MAP : ClassMap<TMQUOTATIONLINEHISTORY>
    {
        public TMQUOTATIONLINEHISTORY_MAP()
        {
            Id(x => x.QLN_NO);
            Map(x => x.QLN_SERVICECODE);
            Map(x => x.QLN_PARTCODE);
            Map(x => x.QLN_QUOTATION);
            Map(x => x.QLN_STATUS);
            Map(x => x.QLN_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', 'QUOTATION#' + QLN_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = QLN_STATUS AND s.STA_ENTITY = 'QUOTATION') ,:SessionContext.Language)");
            Map(x => x.QLN_CREATED);
            Map(x => x.QLN_CUSTOMER);
            Map(x => x.QLN_UNITPURCHASEPRICE);
            Map(x => x.QLN_PURCHASECURR);
            Map(x => x.QLN_PURCHASEEXCH);
            Map(x => x.QLN_UNITSALESPRICE);
            Map(x => x.QLN_CURR);
        }
    }
}