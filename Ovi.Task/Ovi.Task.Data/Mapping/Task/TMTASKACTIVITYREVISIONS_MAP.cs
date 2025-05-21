using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKACTIVITYREVISIONS_MAP : ClassMap<TMTASKACTIVITYREVISIONS>
    {
        public TMTASKACTIVITYREVISIONS_MAP()
        {
            Id(x => x.REV_ID);
            Map(x => x.REV_TASK);
            Map(x => x.REV_LINE);
            Map(x => x.REV_SCHFROM);
            Map(x => x.REV_SCHTO);
            Map(x => x.REV_NO);
            Map(x => x.REV_REASON).Length(PropertySettings.L4001);
            Map(x => x.REV_CREATED);
            Map(x => x.REV_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.REV_UPDATED);
            Map(x => x.REV_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.REV_RECORDVERSION).Default("0");
        }
    }
}