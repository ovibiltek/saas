using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKCLOSINGCODES
    {
        public virtual long CLC_TASK { get; set; }

        public virtual string CLC_FAILURE { get; set; }

        public virtual string CLC_FAILUREDESC { get; set; }

        public virtual string CLC_FAILURECODEDESC { get; set; }

        public virtual string CLC_CAUSE { get; set; }

        public virtual string CLC_CAUSEDESC { get; set; }

        public virtual string CLC_CAUSECODEDESC { get; set; }

        public virtual string CLC_ACTION { get; set; }

        public virtual string CLC_ACTIONDESC { get; set; }

        public virtual string CLC_ACTIONCODEDESC { get; set; }

        public virtual string CLC_CREATEDBY { get; set; }

        public virtual DateTime CLC_CREATED { get; set; }

        public virtual string CLC_UPDATEDBY { get; set; }

        public virtual DateTime? CLC_UPDATED { get; set; }

        public virtual int CLC_RECORDVERSION { get; set; }
    }
}