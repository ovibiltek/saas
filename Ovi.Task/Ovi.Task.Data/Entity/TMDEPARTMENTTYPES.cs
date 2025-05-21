using System;

namespace Ovi.Task.Data.Entity
{
    public class TMDEPARTMENTTYPES
    {
        public virtual long DPT_ID { get; set; }

        public virtual string DPT_TYPEENTITY { get; set; }

        public virtual string DPT_TYPECODE { get; set; }

        public virtual string DPT_DEPCODE { get; set; }

        public virtual DateTime DPT_CREATED { get; set; }

        public virtual string DPT_CREATEDBY { get; set; }

        public virtual int DPT_RECORDVERSION { get; set; }
    }
}