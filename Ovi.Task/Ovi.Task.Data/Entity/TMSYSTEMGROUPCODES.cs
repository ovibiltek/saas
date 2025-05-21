using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSYSTEMGROUPCODES
    {
        public virtual string SGC_CODE { get; set; }

        public virtual string SGC_DESC { get; set; }

        public virtual string SGC_DESCF { get; set; }

        public virtual char SGC_ACTIVE { get; set; }

        public virtual int SGC_SQLIDENTITY { get; set; }

        public virtual DateTime SGC_CREATED { get; set; }

        public virtual string SGC_CREATEDBY { get; set; }

        public virtual DateTime? SGC_UPDATED { get; set; }

        public virtual string SGC_UPDATEDBY { get; set; }

        public virtual int SGC_RECORDVERSION { get; set; }
    }
}