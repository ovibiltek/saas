using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTASKRATINGREVIEWS
    {
        public virtual int TRR_TSKID { get; set; }

        public virtual int TRR_ID { get; set; }

        public virtual string TRR_REVIEW { get; set; }

        public virtual string TRR_SENDMAIL { get; set; }
        public virtual string TRR_CREATEDBY { get; set; }

        public virtual DateTime TRR_CREATED { get; set; }
    }
}