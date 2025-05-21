using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONMISCCOST_MAP : ClassMap<TMQUOTATIONMISCCOST>
    {
        public TMQUOTATIONMISCCOST_MAP()
        {
            Id(x => x.MSC_ID);
            Map(x => x.MSC_QUOTATION);
            Map(x => x.MSC_DESC);
            Map(x => x.MSC_TYPE);
            Map(x => x.MSC_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMMISCCOSTTYPES','MCT_DESC', MSC_TYPE, (SELECT m.MCT_DESC FROM TMMISCCOSTTYPES m WHERE m.MCT_CODE = MSC_TYPE),:SessionContext.Language)");
            Map(x => x.MSC_PTYPE);
            Map(x => x.MSC_BRAND);
            Map(x => x.MSC_PART);
            Map(x => x.MSC_PARTCODE).ReadOnly().Formula("(SELECT p.PAR_CODE FROM TMPARTS p WHERE p.PAR_ID = MSC_PART)");
            Map(x => x.MSC_PARTDESCRIPTION).ReadOnly().Formula("(SELECT p.PAR_DESC FROM TMPARTS p WHERE p.PAR_ID = MSC_PART)");
            Map(x => x.MSC_SERVICECODE);
            Map(x => x.MSC_SERVICECODEDESCRIPTION).Formula("dbo.GetDesc('TMSERVICECODES','SRV_DESCRIPTION', MSC_SERVICECODE, (SELECT s.SRV_DESCRIPTION FROM TMSERVICECODES s WHERE s.SRV_CODE= MSC_SERVICECODE),:SessionContext.Language)");
            Map(x => x.MSC_QTY);
            Map(x => x.MSC_UOM);
            Map(x => x.MSC_UNITPURCHASEPRICE);
            Map(x => x.MSC_PURCHASEDISCOUNTRATE);
            Map(x => x.MSC_PURCHASEDISCOUNTEDUNITPRICE);
            Map(x => x.MSC_TOTALPURCHASEPRICE);
            Map(x => x.MSC_PURCHASEPRICECURR);
            Map(x => x.MSC_PURCHASEPRICECURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', MSC_PURCHASEPRICECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = MSC_PURCHASEPRICECURR), :SessionContext.Language)");
            Map(x => x.MSC_PURCHASEEXCH);
            Map(x => x.MSC_UNITSALESPRICE);
            Map(x => x.MSC_SALESDISCOUNTRATE);
            Map(x => x.MSC_SALESDISCOUNTEDUNITPRICE);
            Map(x => x.MSC_TOTALSALESPRICE);
            Map(x => x.MSC_REFERENCE);
            Map(x => x.MSC_SALESPRICECURR);
            Map(x => x.MSC_SALESPRICECURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', MSC_SALESPRICECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = MSC_SALESPRICECURR), :SessionContext.Language)");
            Map(x => x.MSC_SALESEXCH);
            Map(x => x.MSC_COPY);
            Map(x => x.MSC_CREATED);
            Map(x => x.MSC_CREATEDBY);
            Map(x => x.MSC_UPDATED);
            Map(x => x.MSC_UPDATEDBY);
            Map(x => x.MSC_RECORDVERSION);
        }
    }
}