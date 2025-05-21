using Ovi.Task.Data.Entity;
using FluentNHibernate.Mapping;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMENTRUSTS_MAP : ClassMap<TMENTRUSTS>
    {
        public TMENTRUSTS_MAP()
        {;
            Id(x => x.ETR_ID);
            Map(x => x.ETR_DESC);
            Map(x => x.ETR_ORG);
            Map(x => x.ETR_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', ETR_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = ETR_ORG),:SessionContext.Language)");
            Map(x => x.ETR_TYPEENTITY);
            Map(x => x.ETR_TYPE);
            Map(x => x.ETR_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', ETR_TYPEENTITY + '#' + ETR_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = ETR_TYPE AND t.TYP_ENTITY = ETR_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.ETR_STATUSENTITY);
            Map(x => x.ETR_STATUS);
            Map(x => x.ETR_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', ETR_STATUSENTITY + '#' + ETR_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = ETR_STATUS AND s.STA_ENTITY = ETR_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.ETR_USER);
            Map(x => x.ETR_CREATEDBY);
            Map(x => x.ETR_CREATED);
            Map(x => x.ETR_UPDATEDBY);
            Map(x => x.ETR_UPDATED);
            Map(x => x.ETR_RECORDVERSION);

        }
    }
}