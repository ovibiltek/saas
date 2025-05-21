using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMENUCONFIGURATION_MAP : ClassMap<TMMENUCONFIGURATION>
    {
        public TMMENUCONFIGURATION_MAP()
        {
            Id(x => x.MNU_ID);
            Map(x => x.MNU_LANG);
            Map(x => x.MNU_STRING).Length(PropertySettings.L4001);
        }
    }
}