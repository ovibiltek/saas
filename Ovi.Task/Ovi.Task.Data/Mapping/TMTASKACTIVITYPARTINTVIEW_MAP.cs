using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity;

namespace Ovi.Task.Data.Maps
{
    public sealed class TMTASKACTIVITYPARTINTVIEW_MAP : ClassMap<TMTASKACTIVITYPARTINTVIEW>
    {
        public TMTASKACTIVITYPARTINTVIEW_MAP()

        {
            Id(x => x.TPR_ID);
            Map(x => x.TPR_TASK);
            Map(x => x.TPR_QTY);
            Map(x => x.TPR_UNITSALESPRICE);
            Map(x => x.TPR_UOM);
            Map(x => x.TPR_CURR);
            Map(x => x.TPR_CUSTOMER);
            Map(x => x.TPR_PARTREF);
        }
    }
}