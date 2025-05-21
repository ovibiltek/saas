using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMFAILURES_MAP : ClassMap<TMFAILURES>
    {
        public TMFAILURES_MAP()
        {
            Id(x => x.FAL_CODE);
            Map(x => x.FAL_DESC);
            Map(x => x.FAL_DESCF).Formula("dbo.GetDesc('TMFAILURES','FAL_DESC', FAL_CODE, FAL_DESC,:SessionContext.Language)");
            Map(x => x.FAL_COMMON);
            Map(x => x.FAL_ACTIVE);
            Map(x => x.FAL_CREATED);
            Map(x => x.FAL_CREATEDBY);
            Map(x => x.FAL_UPDATED);
            Map(x => x.FAL_UPDATEDBY);
            Map(x => x.FAL_SQLIDENTITY).Generated.Insert();
            Map(x => x.FAL_RECORDVERSION).Default("0");
        }
    }
}