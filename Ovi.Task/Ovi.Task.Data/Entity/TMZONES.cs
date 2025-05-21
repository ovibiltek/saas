using System;

namespace Ovi.Task.Data.Entity
{
    public class TMZONES
    {
        public virtual string ZON_CODE { get; set; }

        public virtual string ZON_DESC { get; set; }

        public virtual string ZON_DESCF { get; set; }

        public virtual string ZON_TYPEENTITY { get; set; }

        public virtual string ZON_TYPE { get; set; }

        public virtual string ZON_TYPEDESC { get; set; }

        public virtual char ZON_ACTIVE { get; set; }

        public virtual DateTime ZON_CREATED { get; set; }

        public virtual string ZON_CREATEDBY { get; set; }

        public virtual DateTime? ZON_UPDATED { get; set; }

        public virtual string ZON_UPDATEDBY { get; set; }

        public virtual int ZON_RECORDVERSION { get; set; }

        public virtual int ZON_SQLIDENTITY { get; set; }
    }
}