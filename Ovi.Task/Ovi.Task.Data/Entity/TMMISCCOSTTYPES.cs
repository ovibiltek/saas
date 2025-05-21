using System;

namespace Ovi.Task.Data.Entity
{
    public class TMMISCCOSTTYPES
    {
        public virtual string MCT_CODE { get; set; }

        public virtual string MCT_DESC { get; set; }

        public virtual string MCT_DESCF { get; set; }

        public virtual string MCT_TYPE { get; set; }

        public virtual char MCT_ACTIVE { get; set; }

        public virtual DateTime MCT_CREATED { get; set; }

        public virtual DateTime? MCT_UPDATED { get; set; }

        public virtual string MCT_CREATEDBY { get; set; }

        public virtual string MCT_UPDATEDBY { get; set; }

        public virtual int MCT_RECORDVERSION { get; set; }
    }
}