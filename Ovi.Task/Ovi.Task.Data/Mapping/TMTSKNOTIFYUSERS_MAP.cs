using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTSKNOTIFYUSERS_MAP : ClassMap<TMTSKNOTIFYUSERS>
    {
        public TMTSKNOTIFYUSERS_MAP()
        {
            Id(x => x.NOU_ID);
            Map(x => x.NOU_TASK);
            Map(x => x.NOU_PARAM);
            Map(x => x.NOU_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.NOU_CREATED);
            Map(x => x.NOU_RECORDVERSION).Default("0");
        }
    }
}