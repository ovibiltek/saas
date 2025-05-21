using System;

namespace Ovi.Task.Data.Entity
{
    public class TMNOTIFICATIONS
    {
        public virtual long NOT_ID { get; set; }

        public virtual string NOT_TYPE { get; set; }

        public virtual string NOT_DESC { get; set; }

        public virtual string NOT_SUBJECT { get; set; }

        public virtual string NOT_SOURCE { get; set; }

        public virtual string NOT_CREATEDBY { get; set; }

        public virtual DateTime NOT_CREATED { get; set; }

        public virtual char NOT_READ { get; set; }

        public virtual int NOT_RECORDVERSION { get; set; }
    }
}