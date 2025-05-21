using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMEQUIPMENTMAINPRICES_MAP : ClassMap<TMEQUIPMENTMAINPRICES>
    {
        public TMEQUIPMENTMAINPRICES_MAP()
        {
            Id(x => x.EMP_ID);
            Map(x => x.EMP_EQUIPMENTTYPE);
            Map(x => x.EMP_EQUIPMENTTYPEENTITY);
            Map(x => x.EMP_TYPEDESC).ReadOnly().Formula("").Formula("dbo.GetDesc('TMTYPES','TYP_DESC', EMP_EQUIPMENTTYPEENTITY + '#' + EMP_EQUIPMENTTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_ENTITY =  EMP_EQUIPMENTTYPEENTITY AND t.TYP_CODE = EMP_EQUIPMENTTYPE) ,:SessionContext.Language)");
            Map(x => x.EMP_PERIODICTASK);
            Map(x => x.EMP_PERIODICTASKDESC).ReadOnly().Formula("dbo.GetDesc('TMPERIODICTASKS','PTK_DESC', EMP_PERIODICTASK, (SELECT p.PTK_DESC FROM TMPERIODICTASKS p WHERE p.PTK_CODE = EMP_PERIODICTASK), :SessionContext.Language)");
            Map(x => x.EMP_ORG);
            Map(x => x.EMP_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', EMP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = EMP_ORG),:SessionContext.Language)");
            Map(x => x.EMP_UNITPURCHASEPRICE);
            Map(x => x.EMP_UNITSALESPRICE);
            Map(x => x.EMP_CURR);
            Map(x => x.EMP_CURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', EMP_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = EMP_CURR), :SessionContext.Language)");
            Map(x => x.EMP_ACTIVE);
            Map(x => x.EMP_CREATED);
            Map(x => x.EMP_CREATEDBY);
            Map(x => x.EMP_UPDATED);
            Map(x => x.EMP_UPDATEDBY);
            Map(x => x.EMP_RECORDVERSION);
        }
    }
}