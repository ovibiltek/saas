using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;
namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKDEFAULTTRADES_MAP : ClassMap<TMTASKDEFAULTTRADES>
    {
        public TMTASKDEFAULTTRADES_MAP()
        {
            Id(x => x.DTR_ID);
            Map(x => x.DTR_TASKTYPE);
            Map(x => x.DTR_BRANCH);
            Map(x => x.DTR_TRADE);
            Map(x => x.DTR_CREATED);
            Map(x => x.DTR_CREATEDBY);
            Map(x => x.DTR_UPDATED);
            Map(x => x.DTR_UPDATEDBY);
            Map(x => x.DTR_RECORDVERSION);
        }
    }
}