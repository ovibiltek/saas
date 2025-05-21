using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.ProgressPayment;

namespace Ovi.Task.Data.Mapping.ProgressPayment
{
    public sealed class TMPSPGROUPCODES_MAP : ClassMap<TMPSPGROUPCODES>
    {
        public TMPSPGROUPCODES_MAP()
        {
            Id(x => x.PSG_ID);
            Map(x => x.PSG_CREATED);
            Map(x => x.PSG_CREATEDBY);
        }
    }
}