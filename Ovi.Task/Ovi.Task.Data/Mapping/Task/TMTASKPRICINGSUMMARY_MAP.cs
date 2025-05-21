using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKPRICINGSUMMARY_MAP : ClassMap<TMTASKPRICINGSUMMARY>
    {
        public TMTASKPRICINGSUMMARY_MAP()
        {
            CompositeId().KeyProperty(x => x.PPR_PROJECT).KeyProperty(x => x.PPR_TASK);
            Map(x => x.PPR_TASKSHORTDESC);
            Map(x => x.PPR_COST);
            Map(x => x.PPR_TOTAL);
            Map(x => x.PPR_TAX2);
            Map(x => x.PPR_PROFIT);
            Map(x => x.PPR_PROFITPERCENT);
            Map(x => x.PPR_VAT);
            Map(x => x.PPR_QUOTATIONFINAL);
            Map(x => x.PPR_CURR);
        }
    }
}