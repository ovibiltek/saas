using System;

namespace Ovi.Task.Data.Entity
{
    public class TMINVOICERETURNLINES
    {
        public virtual int IRL_ID { get; set; }
        public virtual int IRL_INVOICECODE { get; set; }
        public virtual int IRL_RETURNINV { get; set; }
        public virtual int IRL_DETAILID { get; set; }
        public virtual string IRL_DETAILTYPE { get; set; }
        public virtual int IRL_TASK { get; set; }
        public virtual int IRL_ACTIVITY { get; set; }
        public virtual decimal IRL_RETURNTOTAL { get; set; }
        public virtual DateTime IRL_CREATED { get; set; }
        public virtual string IRL_CREATEDBY { get; set; }
        public virtual DateTime? IRL_UPDATED { get; set; }
        public virtual string IRL_UPDATEDBY { get; set; }
    }
}
