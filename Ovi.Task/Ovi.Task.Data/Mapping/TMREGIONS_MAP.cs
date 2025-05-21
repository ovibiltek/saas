using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMREGIONS_MAP : ClassMap<TMREGIONS>
    {
        public TMREGIONS_MAP()
        {
            Id(x => x.REG_CODE).Length(PropertySettings.L50);
            Map(x => x.REG_DESC).Length(PropertySettings.L250);
            Map(x => x.REG_DESCF).Formula("dbo.GetDesc('TMREGIONS','REG_DESC', REG_CODE, REG_DESC, :SessionContext.Language)");
            Map(x => x.REG_ACTIVE);
            Map(x => x.REG_REPORTINGRESPONSIBLE).Length(PropertySettings.L50);
            Map(x => x.REG_PLANNINGRESPONSIBLE).Length(PropertySettings.L50);
            Map(x => x.REG_SUPERVISOR).Length(PropertySettings.L50);
            Map(x => x.REG_RESPONSIBLE).Length(PropertySettings.L4001);
            Map(x => x.REG_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.REG_CREATED);
            Map(x => x.REG_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.REG_UPDATED);
            Map(x => x.REG_RECORDVERSION).Default("0");
            Map(x => x.REG_SQLIDENTITY).Generated.Insert();
        }
    }
}