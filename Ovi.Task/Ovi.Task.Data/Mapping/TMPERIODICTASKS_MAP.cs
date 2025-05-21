using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMPERIODICTASKS_MAP : ClassMap<TMPERIODICTASKS>
    {
        public TMPERIODICTASKS_MAP()
        {
            Id(x => x.PTK_CODE);
            Map(x => x.PTK_DESC);
            Map(x => x.PTK_DESCF).Formula("dbo.GetDesc('TMPERIODICTASKS','PTK_DESC', PTK_CODE, PTK_DESC, :SessionContext.Language)");
            Map(x => x.PTK_ORGANIZATION);
            Map(x => x.PTK_ORGANIZATIONDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', PTK_ORGANIZATION,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = PTK_ORGANIZATION),:SessionContext.Language)");
            Map(x => x.PTK_TYPEENTITY);
            Map(x => x.PTK_TYPE);
            Map(x => x.PTK_TYPEDESC).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', PTK_TYPEENTITY + '#' + PTK_TASKTYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = PTK_TASKTYPE AND t.TYP_ENTITY = PTK_TYPEENTITY),:SessionContext.Language)");
            Map(x => x.PTK_TASKTYPE);
            Map(x => x.PTK_TASKTYPEDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('TASKTYPE',PTK_TASKTYPE,:SessionContext.Language)");   
            Map(x => x.PTK_CATEGORY);
            Map(x => x.PTK_CATEGORYDESC).Formula("dbo.GetDesc('TMCATEGORIES','CAT_DESC',  + PTK_CATEGORY, (SELECT c.CAT_DESC FROM TMCATEGORIES c WHERE c.CAT_CODE = PTK_CATEGORY),:SessionContext.Language)");
            Map(x => x.PTK_FREQUENCY);
            Map(x => x.PTK_FREQUENCYPART);
            Map(x => x.PTK_PRIORITY);
            Map(x => x.PTK_PRIORITYDESC).Formula("dbo.GetDesc('TMPRIORITIES','PRI_DESC', PTK_PRIORITY, (SELECT p.PRI_DESC FROM TMPRIORITIES p WHERE p.PRI_CODE = PTK_PRIORITY),:SessionContext.Language)");
            Map(x => x.PTK_IGNOREMONDAYS);
            Map(x => x.PTK_IGNORETUESDAYS);
            Map(x => x.PTK_IGNOREWEDNESDAYS);
            Map(x => x.PTK_IGNORETHURSDAYS);
            Map(x => x.PTK_IGNOREFRIDAYS);
            Map(x => x.PTK_IGNORESATURDAYS);
            Map(x => x.PTK_IGNORESUNDAYS);
            Map(x => x.PTK_IGNOREOFFICIALHOLIDAYS);
            Map(x => x.PTK_RFREQUENCY);
            Map(x => x.PTK_RFREQUENCYPART);
            Map(x => x.PTK_AUTOCREATE);
            Map(x => x.PTK_AUTOCREATIONTIME);
            Map(x => x.PTK_ACTIVE);
            Map(x => x.PTK_CREATED);
            Map(x => x.PTK_UPDATED);
            Map(x => x.PTK_CREATEDBY);
            Map(x => x.PTK_UPDATEDBY);
            Map(x => x.PTK_SQLIDENTITY).Generated.Insert();
            Map(x => x.PTK_RECORDVERSION).Default("0");
        }
    }
}