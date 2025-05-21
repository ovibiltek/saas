using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKACTIVITYSERVICECODES
    {
        public virtual int ASR_ID { get; set; }

        public virtual int ASR_ACTIVITY { get; set; }

        public virtual int ASR_SERVICECODE { get; set; }

        public virtual string ASR_SERVICECODEDESC { get; set; }

        public virtual string ASR_SERVICECODEUOM { get; set; }

        public virtual decimal ASR_QUANTITY { get; set; }

        public virtual decimal ASR_UNITPRICE { get; set; }

        public virtual decimal ASR_UNITSALESPRICE { get; set; }

        public virtual char ASR_ALLOWZERO { get; set; }

        public virtual string ASR_CURRENCY { get; set; }

        public virtual string ASR_PRICINGMETHOD { get; set; }

        public virtual decimal ASR_EXCH { get; set; }

        public virtual DateTime ASR_CREATED { get; set; }

        public virtual string ASR_CREATEDBY { get; set; }

        public virtual DateTime? ASR_UPDATED { get; set; }

        public virtual string ASR_UPDATEDBY { get; set; }

        public virtual int ASR_RECORDVERSION { get; set; }
    }
}