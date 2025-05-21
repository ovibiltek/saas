using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSCREENS_MAP : ClassMap<TMSCREENS>
    {
        public TMSCREENS_MAP()
        {
            Id(x => x.SCR_CODE).Length(PropertySettings.L50);
            Map(x => x.SCR_DESC).Length(PropertySettings.L250);
            Map(x => x.SCR_DESCF).Formula("dbo.GetDesc('TMSCREENS','SCR_DESC', SCR_CODE, SCR_DESC,:SessionContext.Language)");
            Map(x => x.SCR_URL).Length(PropertySettings.L250);
            Map(x => x.SCR_CONTROLLER).Length(PropertySettings.L250);
            Map(x => x.SCR_CLASS).Length(PropertySettings.L250);
            Map(x => x.SCR_ACTIVE);
            Map(x => x.SCR_CREATED);
            Map(x => x.SCR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SCR_UPDATED);
            Map(x => x.SCR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SCR_RECORDVERSION).Default("0");
            Map(x => x.SCR_HASGUIDE);
        }
    }
}