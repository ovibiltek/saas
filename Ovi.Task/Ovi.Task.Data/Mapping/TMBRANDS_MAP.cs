using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMBRANDS_MAP : ClassMap<TMBRANDS>
    {
        public TMBRANDS_MAP()
        {
            Id(x => x.BRA_CODE);
            Map(x => x.BRA_DESC);
            Map(x => x.BRA_DESCF).Formula("dbo.GetDesc('TMBRANDS','BRA_DESC', BRA_CODE, BRA_DESC,:SessionContext.Language)");
            Map(x => x.BRA_ACTIVE);
            Map(x => x.BRA_CREATED);
            Map(x => x.BRA_CREATEDBY);
            Map(x => x.BRA_UPDATED);
            Map(x => x.BRA_UPDATEDBY);
            Map(x => x.BRA_SQLIDENTITY).Generated.Insert();
            Map(x => x.BRA_RECORDVERSION).Default("0");
        }
    }
}