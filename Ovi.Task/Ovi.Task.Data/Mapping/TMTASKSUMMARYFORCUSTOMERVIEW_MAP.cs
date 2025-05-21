using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTASKSUMMARYFORCUSTOMERVIEW_MAP : ClassMap<TMTASKSUMMARYFORCUSTOMERVIEW>
    {
        public TMTASKSUMMARYFORCUSTOMERVIEW_MAP()
        {
            Id(x => x.TLN_ID);
            Map(x => x.TLN_TYPE);
            Map(x => x.TLN_TSK);
            Map(x => x.TLN_DESC);
            Map(x => x.TLN_QTY);
            Map(x => x.TLN_DATE);
        }
    }
}