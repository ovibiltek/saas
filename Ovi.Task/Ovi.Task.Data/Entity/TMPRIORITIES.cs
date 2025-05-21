using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPRIORITIES
    {
        public virtual string PRI_CODE { get; set; }

        public virtual string PRI_DESC { get; set; }

        public virtual string PRI_DESCF { get; set; }

        public virtual string PRI_ORGANIZATION { get; set; }

        public virtual string PRI_ORGANIZATIONDESC { get; set; }

        public virtual string PRI_COLOR { get; set; }

        public virtual string PRI_CSS { get; set; }

        public virtual char PRI_ACTIVE { get; set; }

        public virtual DateTime PRI_CREATED { get; set; }

        public virtual string PRI_CREATEDBY { get; set; }

        public virtual DateTime? PRI_UPDATED { get; set; }

        public virtual string PRI_UPDATEDBY { get; set; }

        public virtual int PRI_SQLIDENTITY { get; set; }

        public virtual int PRI_RECORDVERSION { get; set; }
    }
}