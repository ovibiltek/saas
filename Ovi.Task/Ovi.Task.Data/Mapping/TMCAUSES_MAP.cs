using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMCAUSES_MAP : ClassMap<TMCAUSES>
    {
        public TMCAUSES_MAP()
        {
            Id(x => x.CAU_CODE);
            Map(x => x.CAU_DESC);
            Map(x => x.CAU_DESCF).Formula("dbo.GetDesc('TMCAUSES','CAU_DESC', CAU_CODE, CAU_DESC, :SessionContext.Language)");
            Map(x => x.CAU_ACTIVE);
            Map(x => x.CAU_CREATED);
            Map(x => x.CAU_CREATEDBY);
            Map(x => x.CAU_UPDATED);
            Map(x => x.CAU_UPDATEDBY);
            Map(x => x.CAU_SQLIDENTITY).Generated.Insert();
            Map(x => x.CAU_RECORDVERSION).Default("0");
        }
    }
}