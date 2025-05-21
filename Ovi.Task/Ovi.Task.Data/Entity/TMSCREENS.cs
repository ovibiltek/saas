using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSCREENS
    {
        public virtual string SCR_CODE { get; set; }

        public virtual string SCR_DESC { get; set; }

        public virtual string SCR_DESCF { get; set; }

        public virtual string SCR_URL { get; set; }

        public virtual string SCR_CONTROLLER { get; set; }

        public virtual string SCR_CLASS { get; set; }

        public virtual char SCR_ACTIVE { get; set; }

        public virtual DateTime SCR_CREATED { get; set; }

        public virtual string SCR_CREATEDBY { get; set; }

        public virtual DateTime? SCR_UPDATED { get; set; }

        public virtual string SCR_UPDATEDBY { get; set; }

        public virtual int SCR_RECORDVERSION { get; set; }

        public virtual char SCR_HASGUIDE { get; set; }
    }
}