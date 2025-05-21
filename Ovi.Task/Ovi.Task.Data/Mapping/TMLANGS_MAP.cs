using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMLANGS_MAP : ClassMap<TMLANGS>
    {
        public TMLANGS_MAP()
        {
            Id(x => x.LNG_CODE).Length(PropertySettings.L50);
            Map(x => x.LNG_CULTURE).Length(PropertySettings.L50);
            Map(x => x.LNG_DESCRIPTION).Length(PropertySettings.L50);
            Map(x => x.LNG_RECORDVERSION).Default("0");
        }
    }
}