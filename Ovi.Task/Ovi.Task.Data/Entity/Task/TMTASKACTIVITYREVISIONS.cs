using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKACTIVITYREVISIONS
    {
        public virtual long REV_ID { get; set; }

        public virtual long REV_TASK { get; set; }

        public virtual long REV_LINE { get; set; }

        public virtual DateTime REV_SCHFROM { get; set; }

        public virtual DateTime REV_SCHTO { get; set; }

        public virtual int REV_NO { get; set; }

        public virtual string REV_REASON { get; set; }

        public virtual DateTime REV_CREATED { get; set; }

        public virtual string REV_CREATEDBY { get; set; }

        public virtual DateTime? REV_UPDATED { get; set; }

        public virtual string REV_UPDATEDBY { get; set; }

        public virtual int REV_RECORDVERSION { get; set; }
    }
}