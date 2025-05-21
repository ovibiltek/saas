using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCAUSES
    {
        public virtual string CAU_CODE { get; set; }

        public virtual string CAU_DESC { get; set; }

        public virtual string CAU_DESCF { get; set; }

        public virtual char CAU_ACTIVE { get; set; }

        public virtual string CAU_CREATEDBY { get; set; }

        public virtual DateTime CAU_CREATED { get; set; }

        public virtual string CAU_UPDATEDBY { get; set; }

        public virtual DateTime? CAU_UPDATED { get; set; }

        public virtual int CAU_SQLIDENTITY { get; set; }

        public virtual int CAU_RECORDVERSION { get; set; }
    }
}