using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKACTIVITYEQUIPMENTS
    {
        public virtual long TAE_ID { get; set; }

        public virtual int? TAE_EQPID { get; set; }

        public virtual string TAE_EQPCODE { get; set; }

        public virtual string TAE_EQPDESC { get; set; }

        public virtual string TAE_EQPTYPE { get; set; }

        public virtual string TAE_EQPTYPEENTITY { get; set; }

        public virtual int TAE_QUANTITY { get; set; }

        public virtual decimal TAE_UNITPRICE { get; set; }

        public virtual decimal TAE_UNITSALESPRICE { get; set; }

        public virtual char TAE_ALLOWZERO { get; set; }

        public virtual string TAE_CURRENCY { get; set; }

        public virtual string TAE_PRICINGMETHOD { get; set; }

        public virtual int TAE_TSAID { get; set; }

        public virtual string TAE_CREATEDBY { get; set; }

        public virtual DateTime TAE_CREATED { get; set; }

        public virtual string TAE_UPDATEDBY { get; set; }

        public virtual DateTime? TAE_UPDATED { get; set; }

        public virtual int TAE_RECORDVERSION { get; set; }
    }
}