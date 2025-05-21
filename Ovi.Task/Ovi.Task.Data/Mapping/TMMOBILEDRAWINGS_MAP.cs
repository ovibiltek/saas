using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMOBILEDRAWINGS_MAP : ClassMap<TMMOBILEDRAWINGS>
    {
        public TMMOBILEDRAWINGS_MAP()
        {
            CompositeId().KeyProperty(x => x.DRW_ACTIVITY).KeyProperty(x => x.DRW_TASK);
            Map(x => x.DRW_DATA).Length(PropertySettings.L4001);
            Map(x => x.DRW_NOTES);
            Map(x => x.DRW_CREATED);
            Map(x => x.DRW_CREATEDBY);
            Map(x => x.DRW_RECORDVERSION);
        }
    }
}