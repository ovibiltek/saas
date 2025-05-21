using System;

namespace Ovi.Task.Data.Entity
{
    public class TMHOLDREASONS
    {
        public virtual string HDR_CODE { get; set; }

        public virtual string HDR_DESC { get; set; }

        public virtual string HDR_DESCF { get; set; }

        public virtual char HDR_ACTIVE { get; set; }

        public virtual char HDR_TMS { get; set; }

        public virtual char HDR_MOBILE { get; set; }

        public virtual string HDR_CLASS { get; set; }

        public virtual string HDR_DEPARTMENT { get; set; }

        public virtual string HDR_CLASSDESC { get; set; }

        public virtual DateTime HDR_CREATED { get; set; }

        public virtual string HDR_CREATEDBY { get; set; }

        public virtual DateTime? HDR_UPDATED { get; set; }

        public virtual string HDR_UPDATEDBY { get; set; }

        public virtual int HDR_RECORDVERSION { get; set; }

        public virtual long HDR_SQLIDENTITY { get; set; }
    }
}