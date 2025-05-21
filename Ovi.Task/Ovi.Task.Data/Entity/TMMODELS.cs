using System;

namespace Ovi.Task.Data.Entity
{
    public class TMMODELS
    {
        public virtual long MDL_ID { get; set; }

        public virtual string MDL_BRAND { get; set; }

        public virtual string MDL_BRANDDESC { get; set; }

        public virtual string MDL_CODE { get; set; }

        public virtual char MDL_ACTIVE { get; set; }

        public virtual DateTime MDL_CREATED { get; set; }

        public virtual string MDL_CREATEDBY { get; set; }

        public virtual DateTime? MDL_UPDATED { get; set; }

        public virtual string MDL_UPDATEDBY { get; set; }

        public virtual int MDL_RECORDVERSION { get; set; }
    }
}