using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSUPPLIERDELIVERY
    {
        public virtual int DEL_ID { get; set; }

        public virtual string DEL_TYPE { get; set; }

        public virtual string DEL_TYPEDESC { get; set; }

        public virtual string DEL_SUPPLIER { get; set; }

        public virtual string DEL_USER { get; set; }

        public virtual string DEL_USERDESC { get; set; }

        public virtual decimal DEL_QTY { get; set; }

        public virtual string DEL_UOM { get; set; }

        public virtual string DEL_UOMDESC { get; set; }

        public virtual DateTime DEL_DATE { get; set; }

        public virtual DateTime DEL_CREATED { get; set; }

        public virtual string DEL_CREATEDBY { get; set; }

        public virtual DateTime? DEL_UPDATED { get; set; }

        public virtual string DEL_UPDATEDBY { get; set; }

        public virtual int DEL_RECORDVERSION { get; set; }
    }
}