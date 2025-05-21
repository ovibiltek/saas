using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDEPARTMENTTYPESVIEW_MAP : ClassMap<TMDEPARTMENTTYPESVIEW>
    {
        public TMDEPARTMENTTYPESVIEW_MAP()
        {
            CompositeId().KeyProperty(x => x.TYP_DEPARTMENT, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.TYP_ENTITY, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.TYP_CODE, a => { a.Length(PropertySettings.L50); });
            Map(x => x.TYP_DESC);
            Map(x => x.TYP_DESCF).Formula("dbo.GetDesc('TMTYPES','TYP_DESC', TYP_ENTITY + '#' + TYP_CODE, TYP_DESC,:SessionContext.Language)");
            Map(x => x.TYP_ORGANIZATION);
            Map(x => x.TYP_SHOWINACTIONBOX);
        }
    }
}