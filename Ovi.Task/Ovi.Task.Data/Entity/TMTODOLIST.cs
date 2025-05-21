using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTODOLIST
    {
        public virtual long TOD_ID { get; set; }

        public virtual string TOD_USER { get; set; }

        public virtual string TOD_TEXT { get; set; }

        public virtual DateTime TOD_DATE { get; set; }

        public virtual string TOD_CREATEDBY { get; set; }

        public virtual DateTime TOD_CREATED { get; set; }

        public virtual DateTime? TOD_COMPLETED { get; set; }

        public virtual string TOD_COMPLETEDBY { get; set; }

        public virtual int TOD_RECORDVERSION { get; set; }
    }

    public class TMTODOLISTEXT
    {
        public virtual long TOD_ID { get; set; }

        public virtual string TOD_USER { get; set; }

        public virtual string TOD_TEXT { get; set; }

        public virtual DateTime TOD_DATE { get; set; }

        public virtual long TOD_DOCCNT { get; set; }

        public virtual long TOD_CMNCNT { get; set; }

        public virtual string TOD_CREATEDBY { get; set; }

        public virtual string TOD_CREATEDBYDESC { get; set; }

        public virtual DateTime TOD_CREATED { get; set; }

        public virtual DateTime? TOD_COMPLETED { get; set; }

        public virtual string TOD_COMPLETEDBY { get; set; }
    }
}