using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKACTIVITYDURATIONS_MAP : ClassMap<TMTASKACTIVITYDURATIONS>
    {
        public TMTASKACTIVITYDURATIONS_MAP()
        {
            Id(x => x.DUR_ID);
            Map(x => x.DUR_TASK);
            Map(x => x.DUR_ACTIVITY);
            Map(x => x.DUR_TRADE);
            Map(x => x.DUR_START);
            Map(x => x.DUR_STARTTYPE);
            Map(x => x.DUR_END);
            Map(x => x.DUR_ENDDTYPE);
            Map(x => x.DUR_STARTLAT);
            Map(x => x.DUR_STARTLNG);
            Map(x => x.DUR_ENDLAT);
            Map(x => x.DUR_ENDLNG);
            Map(x => x.DUR_CREATEDBY);
            Map(x => x.DUR_CREATED);
            Map(x => x.DUR_UPDATED);
            Map(x => x.DUR_UPDATEDBY);
            Map(x => x.DUR_RECORDVERSION).Default("0");
        }
    }
}