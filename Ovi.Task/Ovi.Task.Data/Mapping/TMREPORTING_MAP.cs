using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMREPORTING_MAP : ClassMap<TMREPORTING>
    {
        public TMREPORTING_MAP()
        {
            Id(x => x.REP_ID);
            Map(x => x.REP_DESC);
            Map(x => x.REP_ORG);
            Map(x => x.REP_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', REP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = REP_ORG),:SessionContext.Language)");
            Map(x => x.REP_TYPE);
            Map(x => x.REP_TYPEENTITY);
            Map(x => x.REP_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', REP_TYPEENTITY + '#' + REP_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = REP_TYPE AND t.TYP_ENTITY = REP_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.REP_STATUS);
            Map(x => x.REP_STATUSENTITY);
            Map(x => x.REP_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', REP_STATUSENTITY + '#' + REP_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = REP_STATUS AND s.STA_ENTITY = REP_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.REP_TSK);
            Map(x => x.REP_TSKDESC).ReadOnly().Formula("(SELECT t.TSK_SHORTDESC FROM TMTASKS t WHERE t.TSK_ID = REP_TSK)");
            Map(x => x.REP_CREATED);
            Map(x => x.REP_CREATEDBY);
            Map(x => x.REP_UPDATED);
            Map(x => x.REP_UPDATEDBY);
            Map(x => x.REP_RECORDVERSION);
        }
    }
}