using System;

namespace Ovi.Task.Data.Entity
{
    public class TMBOOKEDHOURSVIEW
    {
        public virtual int BOO_ID { get; set; }

        public virtual string BOO_USER { get; set; }

        public virtual string BOO_USRDESC { get; set; }

        public virtual string BOO_TRADE { get; set; }

        public virtual string BOO_CATDESC { get; set; }

        public virtual int BOO_TASK { get; set; }

        public virtual string BOO_TSKORG { get; set; }

        public virtual string BOO_TSKSHORTDESC { get; set; }

        public virtual string BOO_BRANCH { get; set; }

        public virtual string BOO_BRANCHDESC { get; set; }

        public virtual string BOO_CUSTOMER { get; set; }

        public virtual string BOO_CUSTOMERDESC { get; set; }

        public virtual string BOO_CREATEDBY { get; set; }

        public virtual char BOO_AUTO { get; set; }

        public virtual DateTime BOO_DATE { get; set; }

        public virtual int BOO_START { get; set; }

        public virtual int BOO_END { get; set; }

        public virtual string BOO_TIME { get; set; }

        public virtual int BOO_MINUTES { get; set; }
    }
}