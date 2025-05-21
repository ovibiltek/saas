using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMTYPELEVELS_MAP : ClassMap<TMTYPELEVELS>
    {
        public TMTYPELEVELS_MAP()
        {
            Id(x => x.TLV_ID);
            Map(x => x.TLV_CODE);
            Map(x => x.TLV_DESC);
            Map(x => x.TLV_TYPE);
            Map(x => x.TLV_TYPEENTITY);
            Map(x => x.TLV_PARENT);
            Map(x => x.TLV_PARENTCODE).ReadOnly().Formula("(SELECT t.TLV_CODE FROM TMTYPELEVELS t WHERE t.TLV_ID = TLV_PARENT)");
            Map(x => x.TLV_PARENTDESC).ReadOnly().Formula("(SELECT t.TLV_DESC FROM TMTYPELEVELS t WHERE t.TLV_ID = TLV_PARENT)");
            Map(x => x.TLV_CREATED);
            Map(x => x.TLV_CREATEDBY);
            Map(x => x.TLV_UPDATED);
            Map(x => x.TLV_UPDATEDBY);
            Map(x => x.TLV_RECORDVERSION);
        }
    }
}