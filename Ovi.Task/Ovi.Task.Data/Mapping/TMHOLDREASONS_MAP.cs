using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMHOLDREASONS_MAP : ClassMap<TMHOLDREASONS>
    {
        public TMHOLDREASONS_MAP()
        {
            Id(x => x.HDR_CODE);
            Map(x => x.HDR_DESC).Length(PropertySettings.L250);
            Map(x => x.HDR_DESCF).Formula("dbo.GetDesc('TMHOLDREASONS','HDR_DESC', HDR_CODE, HDR_DESC,:SessionContext.Language)");
            Map(x => x.HDR_ACTIVE);
            Map(x => x.HDR_TMS);
            Map(x => x.HDR_CLASS);
            Map(x => x.HDR_DEPARTMENT);
            Map(x => x.HDR_CLASSDESC).ReadOnly().Formula("dbo.GetSysCodeDescription('HOLDREASONCLASS',HDR_CLASS,:SessionContext.Language)");                     
            Map(x => x.HDR_MOBILE);
            Map(x => x.HDR_CREATED);
            Map(x => x.HDR_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.HDR_UPDATED);
            Map(x => x.HDR_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.HDR_RECORDVERSION).Default("0");
            Map(x => x.HDR_SQLIDENTITY).Generated.Insert();
        }
    }
}