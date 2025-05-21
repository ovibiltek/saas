using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Quotation;

namespace Ovi.Task.Data.Mapping.Quotation
{
    public sealed class TMQUOTATIONLABOR_MAP : ClassMap<TMQUOTATIONLABOR>
    {
        public TMQUOTATIONLABOR_MAP()
        {
            Id(x => x.LAB_ID);
            Map(x => x.LAB_QUOTATION);
            Map(x => x.LAB_PERIOD);
            Map(x => x.LAB_PERIODUNIT);
            Map(x => x.LAB_TRADE);
            Map(x => x.LAB_TRADEDESC).ReadOnly().Formula("(SELECT t.TRD_DESC FROM TMTRADES t WHERE t.TRD_CODE = LAB_TRADE)");
            Map(x => x.LAB_SERVICECODE);
            Map(x => x.LAB_SERVICECODEDESCRIPTION).Formula("dbo.GetDesc('TMSERVICECODES','SRV_DESCRIPTION', LAB_SERVICECODE, (SELECT s.SRV_DESCRIPTION FROM TMSERVICECODES s WHERE s.SRV_CODE= LAB_SERVICECODE),:SessionContext.Language)");
            Map(x => x.LAB_ASSIGNEDTO);
            Map(x => x.LAB_REFERENCE);
            Map(x => x.LAB_UNITPURCHASEPRICE);
            Map(x => x.LAB_PURCHASEDISCOUNTRATE);
            Map(x => x.LAB_PURCHASEDISCOUNTEDUNITPRICE);
            Map(x => x.LAB_TOTALPURCHASEPRICE);
            Map(x => x.LAB_PURCHASEEXCH);
            Map(x => x.LAB_SALESEXCH);
            Map(x => x.LAB_PURCHASEPRICECURR);
            Map(x => x.LAB_PURCHASEPRICECURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', LAB_PURCHASEPRICECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = LAB_PURCHASEPRICECURR), :SessionContext.Language)");
            Map(x => x.LAB_UNITSALESPRICE);
            Map(x => x.LAB_SALESDISCOUNTRATE);
            Map(x => x.LAB_SALESDISCOUNTEDUNITPRICE);
            Map(x => x.LAB_TOTALSALESPRICE);
            Map(x => x.LAB_SALESPRICECURR);
            Map(x => x.LAB_COPY);
            Map(x => x.LAB_SALESPRICECURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', LAB_SALESPRICECURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = LAB_SALESPRICECURR), :SessionContext.Language)");
            Map(x => x.LAB_CREATED);
            Map(x => x.LAB_CREATEDBY);
            Map(x => x.LAB_UPDATED);
            Map(x => x.LAB_UPDATEDBY);
            Map(x => x.LAB_RECORDVERSION);
        }
    }
}