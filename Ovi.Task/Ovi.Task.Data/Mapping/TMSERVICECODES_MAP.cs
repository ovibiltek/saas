using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSERVICECODES_MAP : ClassMap<TMSERVICECODES>
    {
        public TMSERVICECODES_MAP()
        {
            Id(x => x.SRV_CODE);
            Map(x => x.SRV_DESCRIPTION).Length(PropertySettings.L250);
            Map(x => x.SRV_DESCRIPTIONF).Formula("dbo.GetDesc('TMSERVICECODES','SRV_DESCRIPTION', SRV_CODE, SRV_DESCRIPTION,:SessionContext.Language)");
            Map(x => x.SRV_ORG).Length(PropertySettings.L50);
            Map(x => x.SRV_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', SRV_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = SRV_ORG),:SessionContext.Language)");
            Map(x => x.SRV_UOM).Length(PropertySettings.L50);
            Map(x => x.SRV_UOMDESC).Formula("dbo.GetDesc('TMUOMS','UOM_DESC', SRV_UOM, (SELECT u.UOM_DESC FROM TMUOMS u WHERE u.UOM_CODE = SRV_UOM),:SessionContext.Language)");
            Map(x => x.SRV_TASKTYPE);
            Map(x => x.SRV_TASKTYPEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('TASKTYPE',SRV_TASKTYPE,:SessionContext.Language)");  
            Map(x => x.SRV_TYPE);
            Map(x => x.SRV_TYPEENTITY);
            Map(x => x.SRV_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SRV_TYPEENTITY + '#' + SRV_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_ENTITY =  SRV_TYPEENTITY AND t.TYP_CODE = SRV_TYPE) ,:SessionContext.Language)");
            Map(x => x.SRV_TYPELEVEL);
            Map(x => x.SRV_TYPELEVELCODE).ReadOnly().Formula("(SELECT t.TLV_CODE FROM TMTYPELEVELS t WHERE t.TLV_ID = SRV_TYPELEVEL)");
            Map(x => x.SRV_TYPELEVELDESC).ReadOnly().Formula("(SELECT t.TLV_DESC FROM TMTYPELEVELS t WHERE t.TLV_ID = SRV_TYPELEVEL)");
            Map(x => x.SRV_PUBLIC);
            Map(x => x.SRV_ACTIVE);
            Map(x => x.SRV_UNITPRICE);
            Map(x => x.SRV_UNITSALESPRICE);
            Map(x => x.SRV_CURRENCY);
            Map(x => x.SRV_CURRENCYDESC).Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', SRV_CURRENCY, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = SRV_CURRENCY), :SessionContext.Language)");
            Map(x => x.SRV_CREATED);
            Map(x => x.SRV_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SRV_UPDATED);
            Map(x => x.SRV_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SRV_RECORDVERSION);
        }
    }
}