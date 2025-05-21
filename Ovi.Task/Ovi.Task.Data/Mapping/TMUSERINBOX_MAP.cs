using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMUSERINBOX_MAP : ClassMap<TMUSERINBOX>
    {
        public TMUSERINBOX_MAP()
        {
            Id(x => x.UIN_ID);
            Map(x => x.UIN_USER);
            Map(x => x.UIN_INBOX);
            Map(x => x.UIN_ORDER);
            Map(x => x.UIN_VISIBLE);
            Map(x => x.UIN_SHOWNONZERO);
        }
    }
}