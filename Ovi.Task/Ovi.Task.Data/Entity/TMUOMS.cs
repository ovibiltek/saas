using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUOMS
    {
        public virtual string UOM_CODE { get; set; }

        public virtual string UOM_DESC { get; set; }

        public virtual char UOM_ACTIVE { get; set; }

        public virtual DateTime UOM_CREATED { get; set; }

        public virtual DateTime? UOM_UPDATED { get; set; }

        public virtual string UOM_CREATEDBY { get; set; }

        public virtual string UOM_UPDATEDBY { get; set; }

        public virtual int UOM_RECORDVERSION { get; set; }
    }
}