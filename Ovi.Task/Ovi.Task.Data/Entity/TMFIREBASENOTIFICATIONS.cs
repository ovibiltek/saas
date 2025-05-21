using System;

namespace Ovi.Task.Data.Entity
{
    public class TMFIREBASENOTIFICATIONS
    {
        public virtual int NOT_ID { get; set; }
        public virtual string NOT_TOPIC { get; set; }
        public virtual string NOT_TITLE { get; set; }
        public virtual string NOT_MESSAGE { get; set; }
        public virtual string NOT_PARAMETERS { get; set; }
        public virtual DateTime NOT_CREATED { get; set; }
        public virtual string NOT_CREATEDBY { get; set; }
    }
}