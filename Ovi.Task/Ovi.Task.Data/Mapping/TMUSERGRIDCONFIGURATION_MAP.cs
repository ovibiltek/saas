using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERGRIDCONFIGURATION_MAP : ClassMap<TMUSERGRIDCONFIGURATION>
    {
        public TMUSERGRIDCONFIGURATION_MAP()
        {
            Id(x => x.UGC_ID);
            Map(x => x.UGC_GRID);
            Map(x => x.UGC_ORDER);
            Map(x => x.UGC_FIELD);
            Map(x => x.UGC_HIDDEN);
            Map(x => x.UGC_WIDTH);
            Map(x => x.UGC_USER);
            Map(x => x.UGC_RECORDVERSION).Default("0");
        }
    }
}