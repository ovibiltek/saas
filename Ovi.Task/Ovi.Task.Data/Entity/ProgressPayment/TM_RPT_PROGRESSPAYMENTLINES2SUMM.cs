using System;

namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TM_RPT_PROGRESSPAYMENTLINES2SUMM
    {
        public virtual long PRC_ID { get; set; }
        public virtual long PRC_TASK { get; set; }
        public virtual string PRC_TSKREFERENCE { get; set; }
        public virtual DateTime? PRC_TSKREQUESTED { get; set; }
        public virtual DateTime? PRC_TSKCOMPLETED { get; set; }
        public virtual string PRC_BRNREFERENCE { get; set; }
        public virtual string PRC_BRNDESC { get; set; }
        public virtual string PRC_TSKCATDESC { get; set; }
        public virtual string PRC_TSKTYPEDESC { get; set; }
        public virtual string PRC_TSKSHORTDESC { get; set; }
        public virtual decimal PRC_SERVICEFEE { get; set; }
        public virtual decimal PRC_PARTTOTAL { get; set; }
        public virtual string PRC_CUSPM { get; set; }
        public virtual decimal PRC_TOTAL { get; set; }
        public virtual decimal PRC_VAT { get; set; }
        public virtual decimal PRC_GRANDTOTAL { get; set; }

    }
}
