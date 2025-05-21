using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDESCRIPTIONS_MAP : ClassMap<TMDESCRIPTIONS>
    {
        public TMDESCRIPTIONS_MAP()
        {
            CompositeId().KeyProperty(x => x.DES_CLASS, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.DES_PROPERTY, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.DES_CODE, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.DES_LANG, a => { a.Length(PropertySettings.L50); });
            Map(x => x.DES_TEXT).Length(PropertySettings.L250);
            Map(x => x.DES_RECORDVERSION).Default("0");
        }
    }
}