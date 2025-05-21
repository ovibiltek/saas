using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBOOKEDHOURSSUMMARY_VIEW_MAP : ClassMap<TMBOOKEDHOURSSUMMARY_VIEW>
    {
        public TMBOOKEDHOURSSUMMARY_VIEW_MAP()
        {
            ReadOnly();
            Id(x => x.BOO_ID);
            Map(x => x.BOO_TASK);
            Map(x => x.BOO_TYPE);
            Map(x => x.BOO_USER);
            Map(x => x.BOO_HOURS);
        }
    }
}