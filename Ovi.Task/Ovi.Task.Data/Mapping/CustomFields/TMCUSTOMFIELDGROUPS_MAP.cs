using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.CustomFields;

namespace Ovi.Task.Data.Mapping.CustomFields
{
    public sealed class TMCUSTOMFIELDGROUPS_MAP : ClassMap<TMCUSTOMFIELDGROUPS>
    {
        public TMCUSTOMFIELDGROUPS_MAP()
        {
            Id(x => x.CFG_CODE);
            Map(x => x.CFG_DESC);
            Map(x => x.CFG_DESCF).Formula("dbo.GetDesc('TMCUSTOMFIELDGROUPS','CFG_DESC', CFG_CODE, CFG_DESC, :SessionContext.Language)");
            Map(x => x.CFG_ORDER);
            Map(x => x.CFG_ACTIVE);
            Map(x => x.CFG_CREATED);
            Map(x => x.CFG_CREATEDBY);
            Map(x => x.CFG_UPDATED);
            Map(x => x.CFG_UPDATEDBY);
            Map(x => x.CFG_SQLIDENTITY).Generated.Insert();
            Map(x => x.CFG_RECORDVERSION).Default("0");
        }
    }
}