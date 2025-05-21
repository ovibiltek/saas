using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERTRADEEXCEPTIONS
    {
        public virtual long UTE_ID { get; set; }

        public virtual string UTE_USER { get; set; }

        public virtual string UTE_USERDESC { get; set; }

        public virtual string UTE_TRADE { get; set; }

        public virtual string UTE_TRADEDESC { get; set; }

        public virtual DateTime UTE_START { get; set; }

        public virtual DateTime UTE_END { get; set; }

        public virtual DateTime UTE_CREATED { get; set; }

        public virtual DateTime? UTE_UPDATED { get; set; }

        public virtual string UTE_CREATEDBY { get; set; }

        public virtual string UTE_UPDATEDBY { get; set; }

        public virtual int UTE_RECORDVERSION { get; set; }
    }
}