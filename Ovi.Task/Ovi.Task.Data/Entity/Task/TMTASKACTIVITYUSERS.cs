using System;

namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKACTIVITYUSERS
    {
        public virtual long TUS_ID { get; set; }

        public virtual long TUS_TASK { get; set; }

        public virtual long TUS_LINE { get; set; }

        public virtual string TUS_USER { get; set; }

        public virtual string TUS_USERDESC { get; set; }

        public virtual string TUS_TYPE { get; set; }

        public virtual DateTime TUS_CREATED { get; set; }

        public virtual string TUS_PICID { get; set; }

        public virtual int TUS_RECORDVERSION { get; set; }
    }
}