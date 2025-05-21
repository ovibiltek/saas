using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMFUNCODES_MAP : ClassMap<TMFUNCODES>
    {
        public TMFUNCODES_MAP()
        {
            Id(x => x.FUN_CODE);
            Map(x => x.FUN_DESCRIPTION);
            Map(x => x.FUN_ACTIVE);
            Map(x => x.FUN_CREATED);
            Map(x => x.FUN_CREATEDBY);
            Map(x => x.FUN_UPDATED);
            Map(x => x.FUN_UPDATEDBY);
            Map(x => x.FUN_SQLIDENTITY).Generated.Insert();
            Map(x => x.FUN_RECORDVERSION).Default("0");
        }
    }
}