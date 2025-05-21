using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTIMEKEEPING_MAP : ClassMap<TMTIMEKEEPING>
    {
        public TMTIMEKEEPING_MAP()
        {
            Id(x => x.TKP_ID);
            Map(x => x.TKP_DESC).Length(PropertySettings.L250);
            Map(x => x.TKP_ORG).Length(PropertySettings.L50);
            Map(x => x.TKP_ORGDESC).ReadOnly().Formula("dbo.GetDesc('TMORGS','ORG_DESC', TKP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = TKP_ORG),:SessionContext.Language)");
            Map(x => x.TKP_DEPARTMENT).Length(PropertySettings.L50);
            Map(x => x.TKP_DEPARTMENTDESC).ReadOnly().Formula("(SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = TKP_DEPARTMENT)");
            Map(x => x.TKP_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.TKP_TYPE).Length(PropertySettings.L50);
            Map(x => x.TKP_TYPEDESC).ReadOnly().Formula("dbo.GetDesc('TMTYPES','TYP_DESC', TKP_TYPEENTITY + '#' + TKP_TYPE, (SELECT t.TYP_DESC FROM TMTYPES t WHERE t.TYP_CODE = TKP_TYPE AND t.TYP_ENTITY = TKP_TYPEENTITY) ,:SessionContext.Language)");
            Map(x => x.TKP_STATUSENTITY).Length(PropertySettings.L50);
            Map(x => x.TKP_STATUS).Length(PropertySettings.L50);
            Map(x => x.TKP_STATUSDESC).ReadOnly().Formula("dbo.GetDesc('TMSTATUSES','STA_DESC', TKP_STATUSENTITY + '#' + TKP_STATUS, (SELECT s.STA_DESC FROM TMSTATUSES s WHERE s.STA_CODE = TKP_STATUS AND s.STA_ENTITY = TKP_STATUSENTITY),:SessionContext.Language)");
            Map(x => x.TKP_STARTDATE);
            Map(x => x.TKP_DURATION);
            Map(x => x.TKP_ENDDATE);
            Map(x => x.TKP_CREATED);
            Map(x => x.TKP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TKP_UPDATED);
            Map(x => x.TKP_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.TKP_RECORDVERSION).Default("0");
        }
    }
}