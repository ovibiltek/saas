using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONPART_MAP : ClassMap<TMQUOTATIONPART>
    {
        public TMQUOTATIONPART_MAP()
        {
            Id(x => x.PAR_ID);
            Map(x => x.PAR_QUOTATION);
            Map(x => x.PAR_PART);
            Map(x => x.PAR_BRAND);
            Map(x => x.PAR_REFERENCE);
            Map(x => x.PAR_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = PAR_PART)");
            Map(x => x.PAR_PARTDESC).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = PAR_PART)");
            Map(x => x.PAR_PARTUOM).ReadOnly().Formula("(SELECT p.PAR_UOM FROM TMPARTS p WHERE p.PAR_ID = PAR_PART)");
            Map(x => x.PAR_QTY);
            Map(x => x.PAR_UNITPURCHASEPRICE);
            Map(x => x.PAR_PURCHASEDISCOUNTRATE);
            Map(x => x.PAR_PURCHASEDISCOUNTEDUNITPRICE);
            Map(x => x.PAR_TOTALPURCHASEPRICE);
            Map(x => x.PAR_PURCHASEEXCH);
            Map(x => x.PAR_SALESEXCH);
            Map(x => x.PAR_PURCHASEPRICECURR);
            Map(x => x.PAR_PURCHASEPRICECURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', PAR_PURCHASEPRICECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = PAR_PURCHASEPRICECURR), :SessionContext.Language)");
            Map(x => x.PAR_UNITSALESPRICE);
            Map(x => x.PAR_SALESDISCOUNTRATE);
            Map(x => x.PAR_SALESDISCOUNTEDUNITPRICE);
            Map(x => x.PAR_TOTALSALESPRICE);
            Map(x => x.PAR_SALESPRICECURR);
            Map(x => x.PAR_SALESPRICECURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', PAR_SALESPRICECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = PAR_SALESPRICECURR), :SessionContext.Language)");
            Map(x => x.PAR_CREATED);
            Map(x => x.PAR_CREATEDBY);
            Map(x => x.PAR_UPDATED);
            Map(x => x.PAR_UPDATEDBY);
            Map(x => x.PAR_RECORDVERSION);
        }
    }
}