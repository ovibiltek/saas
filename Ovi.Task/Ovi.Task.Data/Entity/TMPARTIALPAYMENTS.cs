using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovi.Task.Data.Entity
{
    public class TMPARTIALPAYMENTS
    {
        public virtual long PTP_ID { get; set; }
        public virtual string PTP_DESC { get; set; }
        public virtual long? PTP_PROGRESSPAYMENT { get; set; }
        public virtual long PTP_SALESINVOICE { get; set; }
        public virtual decimal PTP_AMOUNT { get; set; }
        public virtual DateTime PTP_CREATED { get; set; }
        public virtual string PTP_CREATEDBY { get; set; }
        public virtual DateTime? PTP_UPDATED { get; set; }
        public virtual string PTP_UPDATEDBY { get; set; }

    }
}
