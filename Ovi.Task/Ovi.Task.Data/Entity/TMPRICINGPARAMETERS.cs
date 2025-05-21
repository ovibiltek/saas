using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPRICINGPARAMETERS
    {
        public virtual string PRP_CODE { get; set; }

        public virtual string PRP_DESC { get; set; }

        public virtual string PRP_ORG { get; set; }

        public virtual string PRP_ORGDESC { get; set; }

        public virtual string PRP_LABORTYPE { get; set; }

        public virtual decimal PRP_SERVICEFEE { get; set; }

        public virtual decimal PRP_HOURLYFEE { get; set; }

        public virtual decimal PRP_CRITICALTIMEVALUE { get; set; }

        public virtual string PRP_CURRENCY { get; set; }

        public virtual string PRP_CURRENCYDESC { get; set; }

        public virtual char PRP_ACTIVE { get; set; }

        public virtual DateTime PRP_CREATED { get; set; }

        public virtual DateTime? PRP_UPDATED { get; set; }

        public virtual string PRP_CREATEDBY { get; set; }

        public virtual string PRP_UPDATEDBY { get; set; }

        public virtual int PRP_RECORDVERSION { get; set; }
    }
}