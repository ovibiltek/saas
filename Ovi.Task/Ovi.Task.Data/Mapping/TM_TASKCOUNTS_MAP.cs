using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TM_TASKCOUNTS_MAP : ClassMap<TM_TASKCOUNTS>
    {
        public TM_TASKCOUNTS_MAP()
        {
            ReadOnly();
            CompositeId().KeyProperty(x => x.TCA_DEPARTMENT)
                .KeyProperty(x => x.TCA_TSKDEPARTMENT)
                .KeyProperty(x => x.TCA_DATE);
            Map(x => x.TCA_MONTH);
            Map(x => x.TCA_COUNT);
            Map(x => x.TCA_YEAR);
        }
    }
}