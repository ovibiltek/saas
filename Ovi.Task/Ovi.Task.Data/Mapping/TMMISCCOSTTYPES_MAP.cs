using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMMISCCOSTTYPES_MAP : ClassMap<TMMISCCOSTTYPES>
    {
        public TMMISCCOSTTYPES_MAP()
        {
            Id(x => x.MCT_CODE).Length(PropertySettings.L50);
            Map(x => x.MCT_DESC).Length(PropertySettings.L250);
            Map(x => x.MCT_DESCF).Formula("dbo.GetDesc('TMMISCCOSTTYPES','MCT_DESC', MCT_CODE, MCT_DESC,:SessionContext.Language)");
            Map(x => x.MCT_TYPE).Length(PropertySettings.L50);
            Map(x => x.MCT_ACTIVE);
            Map(x => x.MCT_CREATED);
            Map(x => x.MCT_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.MCT_UPDATED);
            Map(x => x.MCT_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.MCT_RECORDVERSION).Default("0");
        }
    }
}