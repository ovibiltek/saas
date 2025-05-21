using System;

namespace Ovi.Task.Data.Entity
{
    public class TMBOOKEDHOURS
    {
        public virtual long BOO_ID { get; set; }

        public virtual long BOO_TASK { get; set; }

        public virtual long BOO_LINE { get; set; }

        public virtual string BOO_LINEDESC { get; set; }

        public virtual string BOO_TRADE { get; set; }

        public virtual string BOO_USER { get; set; }

        public virtual string BOO_USERDESC { get; set; }

        public virtual string BOO_OTYPE { get; set; }

        public virtual DateTime BOO_DATE { get; set; }

        public virtual decimal BOO_START { get; set; }

        public virtual decimal BOO_END { get; set; }

        public virtual decimal BOO_CALCHOURS { get; set; }

        public virtual string BOO_TYPE { get; set; }

        public virtual char BOO_AUTO { get; set; }

        public virtual DateTime BOO_CREATED { get; set; }

        public virtual string BOO_CREATEDBY { get; set; }

        public virtual DateTime? BOO_UPDATED { get; set; }

        public virtual string BOO_UPDATEDBY { get; set; }

        public virtual int BOO_RECORDVERSION { get; set; }
    }
}