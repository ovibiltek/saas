using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTODOLIST_MAP : ClassMap<TMTODOLIST>
    {
        public TMTODOLIST_MAP()
        {
            Id(x => x.TOD_ID);
            Map(x => x.TOD_USER).Length(PropertySettings.L50);
            Map(x => x.TOD_TEXT).Length(PropertySettings.L250);
            Map(x => x.TOD_DATE);
            Map(x => x.TOD_CREATED);
            Map(x => x.TOD_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TOD_COMPLETEDBY).Length(PropertySettings.L50);
            Map(x => x.TOD_COMPLETED);
            Map(x => x.TOD_RECORDVERSION).Default("0");
        }
    }
}