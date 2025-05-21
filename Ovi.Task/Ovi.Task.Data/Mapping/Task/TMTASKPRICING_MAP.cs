using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKPRICING_MAP : ClassMap<TMTASKPRICING>
    {
        public TMTASKPRICING_MAP()
        {
            Id(x => x.TPR_ID);
            Map(x => x.TPR_ACTIVITY);
            Map(x => x.TPR_CODE);
            Map(x => x.TPR_CURR);
            Map(x => x.TPR_DESC);
            Map(x => x.TPR_QTY);
            Map(x => x.TPR_TASK);
            Map(x => x.TPR_TYPECODE);
            Map(x => x.TPR_TYPE);
            Map(x => x.TPR_UNITPRICE);
            Map(x => x.TPR_TOTALPRICE);
            Map(x => x.TPR_UNITSALESPRICE);
            Map(x => x.TPR_TOTALSALESPRICE);
            Map(x => x.TPR_ALLOWZERO);
            Map(x => x.TPR_UOM);
            Map(x => x.TPR_PRICINGMETHOD);
            Map(x => x.TPR_EXCH);
            Map(x => x.TPR_RECORDID);

        }
    }
}
