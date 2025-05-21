using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKPRICINGPRINTVIEW
    {
        public virtual int TPR_ID { get; set; }
        public virtual int TPR_TASK { get; set; }
        public virtual string TPR_DESC { get; set; }
        public virtual decimal TPR_QTY { get; set; }
        public virtual string TPR_UOM { get; set; }
        public virtual string TPR_PARBRAND { get; set; }
        public virtual string TPR_CODE { get; set; }
    }
}
