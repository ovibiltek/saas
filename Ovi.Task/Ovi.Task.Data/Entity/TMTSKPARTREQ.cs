using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTSKPARTREQ
    {
        public virtual long PRQ_ID { get; set; }

        public virtual long PRQ_TASK { get; set; }

        public virtual long PRQ_PART { get; set; }

        public virtual DateTime PRQ_CREATED { get; set; }

        public virtual string PRQ_CREATEDBY { get; set; }

        public virtual int PRQ_RECORDVERSION { get; set; }
    }
}