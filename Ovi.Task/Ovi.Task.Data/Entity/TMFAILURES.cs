using System;

namespace Ovi.Task.Data.Entity
{
    public class TMFAILURES
    {
        public virtual string FAL_CODE { get; set; }

        public virtual string FAL_DESC { get; set; }

        public virtual string FAL_DESCF { get; set; }

        public virtual char FAL_ACTIVE { get; set; }

        public virtual char FAL_COMMON { get; set; }

        public virtual string FAL_CREATEDBY { get; set; }

        public virtual DateTime FAL_CREATED { get; set; }

        public virtual string FAL_UPDATEDBY { get; set; }

        public virtual DateTime? FAL_UPDATED { get; set; }

        public virtual int FAL_SQLIDENTITY { get; set; }

        public virtual int FAL_RECORDVERSION { get; set; }
    }
}