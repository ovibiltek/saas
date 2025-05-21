using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSCREENGUIDES
    {

        public virtual string SCG_SCREENCODE { get; set; }

        public virtual string SCG_ENDUSERGUIDE { get; set; }

        public virtual string SCG_ADMINGUIDE { get; set; }

        public virtual string SCG_CREATEDBY { get; set; }

        public virtual DateTime SCG_CREATED { get; set; }

        public virtual string SCG_UPDATEDBY { get; set; }

        public virtual DateTime? SCG_UPDATED { get; set; }

    }
}
