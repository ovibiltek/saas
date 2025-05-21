using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMAUDITFIELDS_MAP : ClassMap<TMAUDITFIELDS>
    {
        public TMAUDITFIELDS_MAP()
        {
            CompositeId().KeyProperty(x => x.AUF_PROPERTY, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.AUF_CLASS, a => { a.Length(PropertySettings.L50); });
            Map(x => x.AUF_ID).Generated.Insert();
            Map(x => x.AUF_ISSECONDARYID);
            Map(x => x.AUF_ACTIVE);
        }
    }
}