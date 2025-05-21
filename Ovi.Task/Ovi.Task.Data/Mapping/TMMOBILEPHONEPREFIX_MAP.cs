using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMOBILEPHONEPREFIX_MAP : ClassMap<TMMOBILEPHONEPREFIX>
    {
        public TMMOBILEPHONEPREFIX_MAP()
        {
            Id(x => x.MPF_ID);
            Map(x => x.MPF_VALUE);
        }
    }
}