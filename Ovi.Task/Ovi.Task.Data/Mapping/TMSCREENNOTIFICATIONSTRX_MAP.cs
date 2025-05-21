using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSCREENNOTIFICATIONSTRX_MAP : ClassMap<TMSCREENNOTIFICATIONSTRX>
    {
        public TMSCREENNOTIFICATIONSTRX_MAP()
        {
            Id(x => x.NTR_ID);
            Map(x => x.NTR_USER);
            Map(x => x.NTR_NOTID);
            Map(x => x.NTR_CREATED);
            Map(x => x.NTR_CREATEDBY);
        }
    }
}