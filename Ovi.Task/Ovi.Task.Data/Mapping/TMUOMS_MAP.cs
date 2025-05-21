using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUOMS_MAP : ClassMap<TMUOMS>
    {
        public TMUOMS_MAP()
        {
            Id(x => x.UOM_CODE).Length(PropertySettings.L50);
            Map(x => x.UOM_DESC).Length(PropertySettings.L250);
            Map(x => x.UOM_ACTIVE);
            Map(x => x.UOM_CREATED);
            Map(x => x.UOM_UPDATED);
            Map(x => x.UOM_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.UOM_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.UOM_RECORDVERSION).Default("0");
        }
    }
}