using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSCREENNOTIFICATIONSTRX
    {
        public virtual long NTR_ID { get; set; }
        public virtual string NTR_USER { get; set; }
        public virtual long NTR_NOTID { get; set; }
        public virtual DateTime NTR_CREATED { get; set; }
        public virtual string NTR_CREATEDBY { get; set; }
    }
}