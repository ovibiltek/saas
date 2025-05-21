using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTYPEPARAMETERS_MAP : ClassMap<TMTYPEPARAMETERS>
    {
        public TMTYPEPARAMETERS_MAP()
        {
            Id(x => x.TPA_ID);
            Map(x => x.TPA_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.TPA_TYPECODE).Length(PropertySettings.L50);
            Map(x => x.TPA_GROUP).Length(PropertySettings.L50);
            Map(x => x.TPA_CODE).Length(PropertySettings.L50);
            Map(x => x.TPA_DESC).Length(PropertySettings.L250);
            Map(x => x.TPA_VALUE).Length(PropertySettings.L250);
            Map(x => x.TPA_CREATED);
            Map(x => x.TPA_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.TPA_UPDATED);
            Map(x => x.TPA_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.TPA_RECORDVERSION).Default("0");
        }
    }
}