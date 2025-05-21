using FluentNHibernate.Mapping;
using Ovi.Task.Data.Configuration;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMDEPARTMENTCATEGORIESVIEW_MAP : ClassMap<TMDEPARTMENTCATEGORIESVIEW>
    {
        public TMDEPARTMENTCATEGORIESVIEW_MAP()
        {
            CompositeId().KeyProperty(x => x.CAT_DEPARTMENT, a => { a.Length(PropertySettings.L50); })
                .KeyProperty(x => x.CAT_CODE, a => { a.Length(PropertySettings.L50); });
            Map(x => x.CAT_DESC);
            Map(x => x.CAT_DESCF).Formula("dbo.GetDesc('TMCATEGORUES','CAT_DESC', CAT_CODE, CAT_DESC ,:SessionContext.Language)");
            Map(x => x.CAT_TSKTYPEREQUIRED);
        }
    }
}