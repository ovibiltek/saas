using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Maps
{
    public sealed class TMCHKLISTTEMPLATETOPICS_MAP : ClassMap<TMCHKLISTTEMPLATETOPICS>
    {
        public TMCHKLISTTEMPLATETOPICS_MAP()
        {
            CompositeId().KeyProperty(x => x.CHT_TEMPLATE).KeyProperty(x => x.CHT_CODE);
            Map(x => x.CHT_DESCRIPTION);
            Map(x => x.CHT_ACTIVE);
            Map(x => x.CHT_ALLOWNEWLINE);
            Map(x => x.CHT_SQLIDENTITY).Generated.Insert();
            Map(x => x.CHT_CREATED);
            Map(x => x.CHT_CREATEDBY);
            Map(x => x.CHT_UPDATED);
            Map(x => x.CHT_UPDATEDBY);
            Map(x => x.CHT_RECORDVERSION).Default("0");
        }
    }
}