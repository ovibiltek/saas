using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTYPEPARAMETERS
    {
        public virtual long TPA_ID { get; set; }

        public virtual string TPA_TYPEENTITY { get; set; }

        public virtual string TPA_TYPECODE { get; set; }

        public virtual string TPA_GROUP { get; set; }

        public virtual string TPA_CODE { get; set; }

        public virtual string TPA_DESC { get; set; }

        public virtual string TPA_VALUE { get; set; }

        public virtual DateTime TPA_CREATED { get; set; }

        public virtual string TPA_CREATEDBY { get; set; }

        public virtual DateTime? TPA_UPDATED { get; set; }

        public virtual string TPA_UPDATEDBY { get; set; }

        public virtual int TPA_RECORDVERSION { get; set; }
    }
}