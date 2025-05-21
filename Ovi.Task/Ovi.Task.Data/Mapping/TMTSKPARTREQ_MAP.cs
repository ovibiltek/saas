using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTSKPARTREQ_MAP : ClassMap<TMTSKPARTREQ>
    {
        public TMTSKPARTREQ_MAP()
        {
            Id(x => x.PRQ_ID);
            Map(x => x.PRQ_TASK);
            Map(x => x.PRQ_PART);
            Map(x => x.PRQ_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.PRQ_CREATED);
            Map(x => x.PRQ_RECORDVERSION).Default("0");
        }
    }
}