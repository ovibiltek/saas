using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCONTRACTSERVICEPRICES_MAP : ClassMap<TMCONTRACTSERVICEPRICES>
    {
        public TMCONTRACTSERVICEPRICES_MAP()
        {
            Id(x => x.CSP_ID);
            Map(x => x.CSP_CONTRACTID);
            Map(x => x.CSP_CUSTOMER).ReadOnly().Formula("(SELECT p.CON_CUSTOMER FROM TMCONTRACTS p WHERE p.CON_ID = CSP_CONTRACTID)");
            Map(x => x.CSP_SERVICECODE);
            Map(x => x.CSP_SERVICECODEDESC).Formula("dbo.GetDesc('TMSERVICECODES','SRV_DESCRIPTION', CSP_SERVICECODE, (SELECT s.SRV_DESCRIPTION FROM TMSERVICECODES s WHERE s.SRV_CODE= CSP_SERVICECODE),:SessionContext.Language)");
            Map(x => x.CSP_REFERENCE);
            Map(x => x.CSP_REGION);
            Map(x => x.CSP_REGIONDESC).ReadOnly().Formula("dbo.GetDesc('TMREGIONS','REG_DESC', CSP_REGION,(SELECT r.REG_DESC FROM TMREGIONS r WHERE r.REG_CODE = CSP_REGION),:SessionContext.Language)");
            Map(x => x.CSP_BRANCH);
            Map(x => x.CSP_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = CSP_BRANCH)");
            Map(x => x.CSP_UNITPURCHASEPRICE);
            Map(x => x.CSP_UNITSALESPRICE);
            Map(x => x.CSP_CURR);
            Map(x => x.CSP_CURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', CSP_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = CSP_CURR), :SessionContext.Language)");
            Map(x => x.CSP_CREATED);
            Map(x => x.CSP_CREATEDBY);
            Map(x => x.CSP_UPDATED);
            Map(x => x.CSP_UPDATEDBY);
            Map(x => x.CSP_RECORDVERSION);
        }
    }
}