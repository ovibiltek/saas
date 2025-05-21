using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTYPELEVELS
    {
        public virtual int TLV_ID { get; set; }

        public virtual string TLV_CODE { get; set; }

        public virtual string TLV_DESC { get; set; }

        public virtual string TLV_TYPE { get; set; }

        public virtual string TLV_TYPEENTITY { get; set; }

        public virtual int? TLV_PARENT { get; set; }

        public virtual string TLV_PARENTCODE { get; set; }

        public virtual string TLV_PARENTDESC { get; set; }

        public virtual DateTime TLV_CREATED { get; set; }

        public virtual string TLV_CREATEDBY { get; set; }

        public virtual DateTime? TLV_UPDATED { get; set; }

        public virtual string TLV_UPDATEDBY { get; set; }

        public virtual int TLV_RECORDVERSION { get; set; }
    }
}