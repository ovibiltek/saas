using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCONTRACTEQUIPMANPRICES_MAP : ClassMap<TMCONTRACTEQUIPMANPRICES>
    {
        public TMCONTRACTEQUIPMANPRICES_MAP()
        {
            Id(x => x.CMP_ID);
            Map(x => x.CMP_CONTRACTID);
            Map(x => x.CMP_CUSTOMER).ReadOnly().Formula("(SELECT p.CON_CUSTOMER FROM TMCONTRACTS p WHERE p.CON_ID = CMP_CONTRACTID)");
            Map(x => x.CMP_PTKCODE);
            Map(x => x.CMP_PTKDESC).ReadOnly().Formula("dbo.GetDesc('TMPERIODICTASKS','PTK_DESC', CMP_PTKCODE, (SELECT p.PTK_DESC FROM TMPERIODICTASKS p WHERE p.PTK_CODE = CMP_PTKCODE), :SessionContext.Language)");
            Map(x => x.CMP_EQUIPMENTTYPEENTITY);
            Map(x => x.CMP_EQUIPMENTTYPE);
            Map(x => x.CMP_EQUIPMENTTYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', CMP_EQUIPMENTTYPEENTITY + '#' + CMP_EQUIPMENTTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = CMP_EQUIPMENTTYPE AND t.TYP_ENTITY = CMP_EQUIPMENTTYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.CMP_REGION);
            Map(x => x.CMP_REGIONDESC).ReadOnly().Formula("dbo.GetDesc('TMREGIONS','REG_DESC', CMP_REGION,(SELECT r.REG_DESC FROM TMREGIONS r WHERE r.REG_CODE = CMP_REGION),:SessionContext.Language)");
            Map(x => x.CMP_BRANCH);
            Map(x => x.CMP_BRANCHDESC).ReadOnly().Formula("(SELECT b.BRN_DESC FROM TMBRANCHES b WHERE b.BRN_CODE = CMP_BRANCH)");
            Map(x => x.CMP_REFERENCE);
            Map(x => x.CMP_EQUIPMENTID);
            Map(x => x.CMP_EQUIPMENTIDDESC).ReadOnly().Formula("(SELECT e.EQP_DESC FROM TMEQUIPMENTS e WHERE e.EQP_ID = CMP_EQUIPMENTID)");
            Map(x => x.CMP_UNITPURCHASEPRICE);
            Map(x => x.CMP_UNITSALESPRICE);
            Map(x => x.CMP_CURRENCY);
            Map(x => x.CMP_CURRENCYDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', CMP_CURRENCY, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = CMP_CURRENCY), :SessionContext.Language)");
            Map(x => x.CMP_CREATED);
            Map(x => x.CMP_CREATEDBY);
            Map(x => x.CMP_UPDATED);
            Map(x => x.CMP_UPDATEDBY);
            Map(x => x.CMP_RECORDVERSION);
        }
    }
}