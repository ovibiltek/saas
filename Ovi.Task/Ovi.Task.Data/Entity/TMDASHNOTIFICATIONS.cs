using System;

using Ovi.Task.Helper.Functional;

namespace Ovi.Task.Data.Entity
{
    public class TMDASHNOTIFICATIONS
    {
        public virtual int DNT_ID { get; set; }

        public virtual string DNT_ENTITY { get; set; }

        public virtual string DNT_REFID { get; set; }

        public virtual string DNT_CONTENT { get; set; }

        public virtual char DNT_ISREADED { get; set; }

        public virtual string DNT_NOTIFICATIONTYPE { get; set; }

        public virtual DateTime DNT_CREATED { get; set; }

        public virtual string DNT_CREATEDBY { get; set; }

        public virtual DateTime? DNT_UPDATED { get; set; }

        public virtual string DNT_UPDATEDBY { get; set; }

    }
}

