using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMAILPARAMS_MAP : ClassMap<TMMAILPARAMS>
    {
        public TMMAILPARAMS_MAP()
        {
            Id(x => x.PR_ID).GeneratedBy.Identity();
            Map(x => x.PR_MAILID);
            Map(x => x.PR_NAME);
            Map(x => x.PR_VALUE).Length(4001);
        }
    }
}