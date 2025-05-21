using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMACTIONS_MAP : ClassMap<TMACTIONS>
    {
        public TMACTIONS_MAP()
        {
            Id(x => x.ACT_CODE);
            Map(x => x.ACT_DESC);
            Map(x => x.ACT_DESCF).Formula("dbo.GetDesc('TMACTIONS','ACT_DESC', ACT_CODE, ACT_DESC, :SessionContext.Language)");
            Map(x => x.ACT_ACTIVE);
            Map(x => x.ACT_CREATED);
            Map(x => x.ACT_CREATEDBY);
            Map(x => x.ACT_UPDATED);
            Map(x => x.ACT_UPDATEDBY);
            Map(x => x.ACT_SQLIDENTITY).Generated.Insert();
            Map(x => x.ACT_RECORDVERSION).Default("0");
        }
    }
}