using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMFIELDMAPS_MAP : ClassMap<TMFIELDMAPS>
    {
        public TMFIELDMAPS_MAP()
        {
            Id(x => x.FMP_ID);
            Map(x => x.FMP_ENTITY).Length(PropertySettings.L50);
            Map(x => x.FMP_CODE).Length(PropertySettings.L50);
            Map(x => x.FMP_FIELD).Length(PropertySettings.L50);
            Map(x => x.FMP_VALUE).Length(PropertySettings.L50);
            Map(x => x.FMP_CREATED);
            Map(x => x.FMP_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.FMP_RECORDVERSION);
        }
    }
}