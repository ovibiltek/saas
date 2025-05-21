using FluentNHibernate.Mapping;
using Ovi.Task.Data.Entity.Task;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Mapping.Task
{
    public sealed class TMTASKPRICINGPRINTVIEW_MAP : ClassMap<TMTASKPRICINGPRINTVIEW>
    {
        public TMTASKPRICINGPRINTVIEW_MAP()
        {
            Id(x => x.TPR_ID);
            Map(x => x.TPR_TASK);
            Map(x => x.TPR_CODE);
            Map(x => x.TPR_DESC);
            Map(x => x.TPR_QTY);
            Map(x => x.TPR_UOM);
            Map(x => x.TPR_PARBRAND);
            
        }
    }
}
