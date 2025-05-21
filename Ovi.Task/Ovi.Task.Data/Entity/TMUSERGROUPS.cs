using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERGROUPS
    {
        public virtual string UGR_CODE { get; set; }

        public virtual string UGR_DESC { get; set; }

        public virtual char UGR_ACTIVE { get; set; }

        public virtual char UGR_CHECKLISTLOCK { get; set; }

        public virtual string UGR_CLASS { get; set; }

        public virtual DateTime UGR_CREATED { get; set; }

        public virtual DateTime? UGR_UPDATED { get; set; }

        public virtual string UGR_CREATEDBY { get; set; }

        public virtual string UGR_UPDATEDBY { get; set; }

        public virtual int UGR_SQLIDENTITY { get; set; }

        public virtual int UGR_RECORDVERSION { get; set; }
    }
}