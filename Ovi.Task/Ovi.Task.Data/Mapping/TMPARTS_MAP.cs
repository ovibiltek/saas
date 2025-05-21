using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPARTS_MAP : ClassMap<TMPARTS>
    {
        public TMPARTS_MAP()
        {
            Id(x => x.PAR_ID);
            Map(x => x.PAR_CODE);
            Map(x => x.PAR_ORG);
            Map(x => x.PAR_ORGDESC).Formula("dbo.GetDesc('TMORGS','ORG_DESC', PAR_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = PAR_ORG),:SessionContext.Language)");
            Map(x => x.PAR_UOM);
            Map(x => x.PAR_UOMDESC).Formula("dbo.GetDesc('TMUOMS','UOM_DESC', PAR_UOM, (SELECT u.UOM_DESC FROM TMUOMS u WHERE u.UOM_CODE = PAR_UOM),:SessionContext.Language)");
            Map(x => x.PAR_BRAND);
            Map(x => x.PAR_BRANDDESC).ReadOnly().Formula("dbo.GetDesc('TMBRANDS','BRA_DESC', PAR_BRAND, (SELECT b.BRA_DESC FROM TMBRANDS b WHERE b.BRA_CODE = PAR_BRAND),:SessionContext.Language)");
            Map(x => x.PAR_DESC);
            Map(x => x.PAR_TYPE);
            Map(x => x.PAR_TYPELEVEL);
            Map(x => x.PAR_TYPELEVELCODE).ReadOnly().Formula("(SELECT o.TLV_CODE FROM TMTYPELEVELS o WHERE o.TLV_ID = PAR_TYPELEVEL)");
            Map(x => x.PAR_TYPELEVELDESC).ReadOnly().Formula("(SELECT o.TLV_DESC FROM TMTYPELEVELS o WHERE o.TLV_ID = PAR_TYPELEVEL)");
            Map(x => x.PAR_TYPEENTITY);
            Map(x => x.PAR_TYPEDESC).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', PAR_TYPEENTITY + '#' + PAR_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = PAR_TYPE AND t.TYP_ENTITY = PAR_TYPEENTITY),:SessionContext.Language)");
            Map(x => x.PAR_UNITSALESPRICE);
            Map(x => x.PAR_CURR);
            Map(x => x.PAR_CURRDESC).ReadOnly().Formula("dbo.GetDesc('TMCURRENCIES','CUR_DESC', PAR_CURR, (SELECT c.CUR_DESC FROM TMCURRENCIES c WHERE c.CUR_CODE = PAR_CURR), :SessionContext.Language)");
            Map(x => x.PAR_ACTIVE);
            Map(x => x.PAR_CREATED);
            Map(x => x.PAR_CREATEDBY);
            Map(x => x.PAR_UPDATED);
            Map(x => x.PAR_UPDATEDBY);
            Map(x => x.PAR_RECORDVERSION);
        }
    }
}