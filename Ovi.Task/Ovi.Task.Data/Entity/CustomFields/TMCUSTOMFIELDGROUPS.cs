using System;

namespace Ovi.Task.Data.Entity.CustomFields
{
    public class TMCUSTOMFIELDGROUPS
    {
        public virtual string CFG_CODE { get; set; }

        public virtual string CFG_DESC { get; set; }

        public virtual string CFG_DESCF { get; set; }

        public virtual int CFG_ORDER { get; set; }

        public virtual char CFG_ACTIVE { get; set; }

        public virtual DateTime CFG_CREATED { get; set; }

        public virtual string CFG_CREATEDBY { get; set; }

        public virtual DateTime? CFG_UPDATED { get; set; }

        public virtual string CFG_UPDATEDBY { get; set; }

        public virtual int CFG_SQLIDENTITY { get; set; }

        public virtual int CFG_RECORDVERSION { get; set; }
    }
}