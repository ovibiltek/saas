using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCHKLISTTEMPLATES
    {
        public virtual string CLT_CODE { get; set; }

        public virtual string CLT_DESC { get; set; }

        public virtual char CLT_ACTIVE { get; set; }

        public virtual DateTime CLT_CREATED { get; set; }

        public virtual string CLT_CREATEDBY { get; set; }

        public virtual DateTime? CLT_UPDATED { get; set; }

        public virtual string CLT_UPDATEDBY { get; set; }

        public virtual int CLT_RECORDVERSION { get; set; }

        public virtual string CLT_ORG { get; set; }

        public virtual char CLT_SEQUENTIAL { get; set; }

    }
}