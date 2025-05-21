using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDAYSVIEW_MAP : ClassMap<TMDAYSVIEW>
    {
        public TMDAYSVIEW_MAP()
        {
            ReadOnly();
            CompositeId().KeyProperty(x => x.TMD_YEAR)
                .KeyProperty(x => x.TMD_WEEK);
            Map(x => x.TMD_FIRSTDAY);
            Map(x => x.TMD_LASTDAY);
        }
    }
}