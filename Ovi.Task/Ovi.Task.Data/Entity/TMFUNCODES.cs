

using System;

namespace Ovi.Task.Data.Entity
{
    public class TMFUNCODES
    {
        public virtual string FUN_CODE { get; set; }
        public virtual string FUN_DESCRIPTION { get; set; }
        public virtual char FUN_ACTIVE { get; set; }
        public virtual string FUN_CREATEDBY { get; set; }
        public virtual DateTime FUN_CREATED { get; set; }
        public virtual string FUN_UPDATEDBY { get; set; }
        public virtual DateTime? FUN_UPDATED { get; set; }
        public virtual int FUN_RECORDVERSION { get; set; }
        public virtual int FUN_SQLIDENTITY { get; set; }
    }
}
