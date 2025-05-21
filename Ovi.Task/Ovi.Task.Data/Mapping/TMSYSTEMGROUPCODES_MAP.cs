using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Maps
{
    public sealed class TMSYSTEMGROUPCODES_MAP : ClassMap<TMSYSTEMGROUPCODES>
    {
        public TMSYSTEMGROUPCODES_MAP()
        { 
            Id(x => x.SGC_CODE); 
            Map(x => x.SGC_DESC);
            Map(x => x.SGC_DESCF).Formula("dbo.GetDesc('TMSYSTEMGROUPCODES','SGC_DESC', SGC_CODE, SGC_DESC,:SessionContext.Language)");
            Map(x => x.SGC_SQLIDENTITY).Generated.Insert();
            Map(x => x.SGC_ACTIVE);
            Map(x => x.SGC_CREATED); 
            Map(x => x.SGC_CREATEDBY); 
            Map(x => x.SGC_UPDATED); 
            Map(x => x.SGC_UPDATEDBY); 
            Map(x => x.SGC_RECORDVERSION); 
        }
    }
}