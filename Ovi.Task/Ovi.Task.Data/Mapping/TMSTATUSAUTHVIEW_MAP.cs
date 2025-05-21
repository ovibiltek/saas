using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSTATUSAUTHVIEW_MAP : ClassMap<TMSTATUSAUTHVIEW>
    {
        public TMSTATUSAUTHVIEW_MAP()
        {
            ReadOnly();
            Id(x => x.SAU_ID);
            Map(x => x.SAU_ENTITY).Length(PropertySettings.L50);
            Map(x => x.SAU_TYPE).Length(PropertySettings.L50);
            Map(x => x.SAU_TYPEDESC).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', SAU_ENTITY + '#' + SAU_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = SAU_TYPE AND t.TYP_ENTITY = SAU_ENTITY),:SessionContext.Language)");
            Map(x => x.SAU_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.SAU_FROM);
            Map(x => x.SAU_PFROM);
            Map(x => x.SAU_FROMDESC).Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', SAU_ENTITY + '#' + SAU_FROM, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = SAU_FROM AND s.STA_ENTITY = SAU_ENTITY  AND s.STA_PCODE = SAU_PFROM),:SessionContext.Language)");
            Map(x => x.SAU_TO);
            Map(x => x.SAU_PTO);
            Map(x => x.SAU_TODESC).Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', SAU_ENTITY + '#' + SAU_TO, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = SAU_TO AND s.STA_ENTITY = SAU_ENTITY AND s.STA_PCODE = SAU_PTO),:SessionContext.Language)");
            Map(x => x.SAU_AUTHORIZED).Length(PropertySettings.L50);
            Map(x => x.SAU_ACTIVE);
            Map(x => x.SAU_SHOWONWORKFLOW);
            Map(x => x.SAU_CREATED);
            Map(x => x.SAU_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SAU_UPDATED);
            Map(x => x.SAU_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SAU_RECORDVERSION).Default("0");
        }
    }
}