using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSCREENNOTIFICATIONS
    {
        public virtual long NOT_ID { get; set; }

        public virtual string NOT_USERGROUP { get; set; }

        public virtual string NOT_SCREEN { get; set; }

        public virtual string NOT_SCREENDESCF { get; set; }

        public virtual string NOT_TITLE { get; set; }

        public virtual string NOT_CONTENT { get; set; }

        public virtual DateTime NOT_EFFECTIVEDATE { get; set; }

        public virtual DateTime NOT_CREATED { get; set; }

        public virtual string NOT_CREATEDBY { get; set; }

        public virtual DateTime? NOT_UPDATED { get; set; }

        public virtual string NOT_UPDATEDBY { get; set; }

        public virtual int NOT_RECORDVERSION { get; set; }

        public virtual char NOT_VISIBLE { get; set; }

    }
}