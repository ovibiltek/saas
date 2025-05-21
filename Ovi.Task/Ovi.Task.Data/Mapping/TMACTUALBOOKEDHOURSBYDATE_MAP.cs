using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMACTUALBOOKEDHOURSBYDATE_MAP : ClassMap<TMACTUALBOOKEDHOURSBYDATE>
    {
        public TMACTUALBOOKEDHOURSBYDATE_MAP()
        {
            ReadOnly();
            Id(x => x.BOO_ID);
            Map(x => x.BOO_USER);
            Map(x => x.BOO_DEPARTMENT);
            Map(x => x.BOO_YEAR);
            Map(x => x.BOO_MONTH);
            Map(x => x.BOO_CALCHOURS);
            Map(x => x.BOO_TYPE);
        }
    }
}