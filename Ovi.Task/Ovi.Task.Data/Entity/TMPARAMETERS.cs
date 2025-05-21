using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPARAMETERS
    {
        public virtual string PRM_CODE { get; set; }

        public virtual string PRM_VALUE { get; set; }

        public virtual string PRM_DESC { get; set; }

        public virtual char PRM_ISENCRYPTED { get; set; }

        public virtual DateTime PRM_CREATED { get; set; }

        public virtual string PRM_CREATEDBY { get; set; }

        public virtual DateTime? PRM_UPDATED { get; set; }

        public virtual string PRM_UPDATEDBY { get; set; }

        public virtual int PRM_RECORDVERSION { get; set; }
    }
}