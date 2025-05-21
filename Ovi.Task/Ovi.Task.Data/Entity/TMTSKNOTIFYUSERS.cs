using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTSKNOTIFYUSERS
    {
        public virtual long NOU_ID { get; set; }

        public virtual long NOU_TASK { get; set; }

        public virtual long NOU_PARAM { get; set; }

        public virtual DateTime NOU_CREATED { get; set; }

        public virtual string NOU_CREATEDBY { get; set; }

        public virtual int NOU_RECORDVERSION { get; set; }
    }
}