using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDEPARTMENTS_MAP : ClassMap<TMDEPARTMENTS>
    {
        public TMDEPARTMENTS_MAP()
        {
            Id(x => x.DEP_CODE).Length(PropertySettings.L50);
            Map(x => x.DEP_DESC).Length(PropertySettings.L250);
            Map(x => x.DEP_DESCF).Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC', DEP_CODE, DEP_DESC, :SessionContext.Language)");
            Map(x => x.DEP_ORG).Length(PropertySettings.L50);
            Map(x => x.DEP_ORGDESC).Formula("dbo.GetDesc('TMORGS','ORG_DESC', DEP_ORG,(SELECT o.ORG_DESC FROM TMORGS o WHERE o.ORG_CODE = DEP_ORG),:SessionContext.Language)");
            Map(x => x.DEP_MANAGER).Length(PropertySettings.L50);
            Map(x => x.DEP_MANAGERDESC).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = DEP_MANAGER)");
            Map(x => x.DEP_TIMEKEEPINGOFFICER).Length(PropertySettings.L50);
            Map(x => x.DEP_TIMEKEEPINGOFFICERDESC).Formula("(SELECT u.USR_DESC FROM TMUSERS u WHERE u.USR_CODE = DEP_TIMEKEEPINGOFFICER)");
            Map(x => x.DEP_AUTHORIZED).Length(PropertySettings.L4001);
            Map(x => x.DEP_ACTIVE);
            Map(x => x.DEP_CREATED);
            Map(x => x.DEP_UPDATED);
            Map(x => x.DEP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.DEP_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.DEP_SQLIDENTITY).Generated.Insert();
            Map(x => x.DEP_RECORDVERSION).Default("0");
        }
    }
}