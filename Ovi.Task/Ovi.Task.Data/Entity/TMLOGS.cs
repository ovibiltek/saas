using System;

namespace Ovi.Task.Data.Entity
{
    public class TMLOGS
    {
        public virtual long TML_ID { get; set; }

        public virtual string TML_BUNIT { get; set; }

        public virtual string TML_BFUNC { get; set; }

        public virtual string TML_MSG { get; set; }

        public virtual string TML_DETAILS { get; set; }

        public virtual DateTime? TML_CREATED { get; set; }

        public virtual string TML_CREATEDBY { get; set; }

        public virtual int TML_RECORDVERSION { get; set; }
    }
}