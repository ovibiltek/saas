using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Mapping
{
    public sealed class TMOBJECTSVIEW_MAP : ClassMap<TMOBJECTSVIEW>
    {
        public TMOBJECTSVIEW_MAP()
        {
            Id(x => x.OBJ_CODE);
            Map(x => x.OBJ_DESC);
            Map(x => x.OBJ_ORG);
            Map(x => x.OBJ_TYPE);
            Map(x => x.OBJ_BRANCH);
            Map(x => x.OBJ_BRANCHDESC);
            Map(x => x.OBJ_DEPARTMENT);
            Map(x => x.OBJ_DEPARTMENTDESC).Formula("dbo.GetDesc('TMDEPARTMENTS','DEP_DESC',OBJ_DEPARTMENT, (SELECT d.DEP_DESC FROM TMDEPARTMENTS d WHERE d.DEP_CODE = OBJ_DEPARTMENT),:SessionContext.Language)");
        }
    }
}