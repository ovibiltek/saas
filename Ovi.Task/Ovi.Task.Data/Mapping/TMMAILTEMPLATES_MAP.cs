using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMAILTEMPLATES_MAP : ClassMap<TMMAILTEMPLATES>
    {
        public TMMAILTEMPLATES_MAP()
        {
            Id(x => x.TMP_ID).GeneratedBy.Identity();
            Map(x => x.TMP_TMPID);
            Map(x => x.TMP_DESCRIPTION);
            Map(x => x.TMP_TRIGGER);
            Map(x => x.TMP_TO);
            Map(x => x.TMP_CC);
            Map(x => x.TMP_BCC);
            Map(x => x.TMP_CONNECTION);
            Map(x => x.TMP_HTML).Length(4001);
            Map(x => x.TMP_ACTIVE);
        }
    }
}