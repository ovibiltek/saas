using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCONFIRMATIONS_MAP : ClassMap<TMCONFIRMATIONS>
    {
        public TMCONFIRMATIONS_MAP()
        {
            Id(x => x.CON_ID);
            Map(x => x.CON_MESSAGE).Length(PropertySettings.L250);
            Map(x => x.CON_INFO).Length(PropertySettings.L4001);
            Map(x => x.CON_SQL).Length(PropertySettings.L4001);
            Map(x => x.CON_CONTROLLER).Length(PropertySettings.L250);
            Map(x => x.CON_ACTIVE);
            Map(x => x.CON_ISVALIDATED);
            Map(x => x.CON_TITLE).Length(PropertySettings.L50);
            Map(x => x.CON_PARAMS).Length(PropertySettings.L4001);
            
        }
    }
}