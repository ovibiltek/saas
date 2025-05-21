using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCHKSWITCH_MAP : ClassMap<TMCHKSWITCH>
    {
        public TMCHKSWITCH_MAP()
        {
            Id(x => x.CHS_ID);
            Map(x => x.CHS_CHKID);
            Map(x => x.CHS_USER).Length(PropertySettings.L50);
            Map(x => x.CHS_TASK);
            Map(x => x.CHS_VALUE);
            Map(x => x.CHS_RECORDVERSION).Default("0");
        }
    }
}