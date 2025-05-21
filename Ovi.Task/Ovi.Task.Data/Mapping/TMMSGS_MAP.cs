using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMSGS_MAP : ClassMap<TMMSGS>
    {
        public TMMSGS_MAP()
        {
            Id(x => x.MSG_ID);
            Map(x => x.MSG_LANG).Length(PropertySettings.L50);
            Map(x => x.MSG_CODE).Length(PropertySettings.L250);
            Map(x => x.MSG_TEXT).Length(PropertySettings.L4001);
            Map(x => x.MSG_RECORDVERSION).Default("0");
        }
    }
}