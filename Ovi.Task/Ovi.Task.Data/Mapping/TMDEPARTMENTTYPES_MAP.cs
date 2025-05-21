using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDEPARTMENTTYPES_MAP : ClassMap<TMDEPARTMENTTYPES>
    {
        public TMDEPARTMENTTYPES_MAP()
        {
            Id(x => x.DPT_ID).GeneratedBy.Identity();
            Map(x => x.DPT_TYPEENTITY).Length(PropertySettings.L50);
            Map(x => x.DPT_TYPECODE).Length(PropertySettings.L50);
            Map(x => x.DPT_DEPCODE).Length(PropertySettings.L50);
            Map(x => x.DPT_CREATED);
            Map(x => x.DPT_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.DPT_RECORDVERSION).Default("0");
        }
    }
}