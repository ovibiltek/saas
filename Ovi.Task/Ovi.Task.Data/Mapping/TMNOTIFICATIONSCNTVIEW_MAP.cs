using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMNOTIFICATIONSCNTVIEW_MAP : ClassMap<TMNOTIFICATIONSCNTVIEW>
    {
        public TMNOTIFICATIONSCNTVIEW_MAP()
        {
            ReadOnly();
            Id(x => x.NOT_ID);
            Map(x => x.NOT_OWNER);
            Map(x => x.NOT_TYPE);
            Map(x => x.NOT_COUNT);
        }
    }
}