using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMSYSCODES_MAP : ClassMap<TMSYSCODES>
    {
        public TMSYSCODES_MAP()
        {
            CompositeId().KeyProperty(x => x.SYC_CODE).KeyProperty(x => x.SYC_GROUP);
            Map(x => x.SYC_DESCRIPTION).Length(PropertySettings.L250);
            Map(x => x.SYC_DESCF).Formula("dbo.GetSysCodeDescription(SYC_GROUP,SYC_CODE,:SessionContext.Language)");
            Map(x => x.SYC_GROUPDESC).ReadOnly().Formula("dbo.GetDesc('TMSYSTEMGROUPCODES','SGC_DESC', SYC_GROUP, (SELECT s.SGC_DESC FROM TMSYSTEMGROUPCODES s WHERE s.SGC_CODE = SYC_GROUP),:SessionContext.Language)");
            Map(x => x.SYC_ORDER);
            Map(x => x.SYC_ACTIVE);
            Map(x => x.SYC_CREATED);
            Map(x => x.SYC_CREATEDBY).Length(PropertySettings.L50);
            Map(x => x.SYC_UPDATED);
            Map(x => x.SYC_PARENT);
            Map(x => x.SYC_PARENTGROUP);
            Map(x => x.SYC_PARENTDESC).Formula("dbo.GetSysCodeDescription(SYC_PARENTGROUP,SYC_PARENT,:SessionContext.Language)");
            Map(x => x.SYC_UPDATEDBY).Length(PropertySettings.L50);
            Map(x => x.SYC_RECORDVERSION).Default("0");
            Map(x => x.SYC_SQLIDENTITY).Generated.Insert();
        }
    }
}