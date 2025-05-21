using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Project;

namespace Ovi.Task.Data.Mapping.Project
{
    public sealed class TMPROJECTOFFERREVISIONS_MAP : ClassMap<TMPROJECTOFFERREVISIONS>
    {
        public TMPROJECTOFFERREVISIONS_MAP()
        {
            Id(x => x.PRV_ID);
            Map(x => x.PRV_PROJECT);
            Map(x => x.PRV_REVNO);
            Map(x => x.PRV_LABORSUM);
            Map(x => x.PRV_MISCCOST);
            Map(x => x.PRV_PART);
            Map(x => x.PRV_TOOL);
            Map(x => x.PRV_FIXEDCOST);
            Map(x => x.PRV_COST);
            Map(x => x.PRV_PROFIT).ReadOnly().Formula("(CAST((PRV_TOTAL - PRV_COST)/PRV_COST * 100 AS NUMERIC(18,2)))");
            Map(x => x.PRV_CURR);
            Map(x => x.PRV_EXCH);
            Map(x => x.PRV_TOTAL);
            Map(x => x.PRV_UPDATED);
            Map(x => x.PRV_UPDATEDBY);
        }
    }
}