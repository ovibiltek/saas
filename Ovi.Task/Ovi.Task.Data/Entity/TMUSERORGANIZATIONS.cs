using System;

namespace Ovi.Task.Data.Entity
{
    public class TMUSERORGANIZATIONS
    {
        public virtual long UOG_ID { get; set; }

        public virtual string UOG_USER { get; set; }

        public virtual string UOG_ORG { get; set; }

        public virtual string UOG_ORGDESC { get; set; }

        public virtual char UOG_DEFAULT { get; set; }

        public virtual DateTime UOG_CREATED { get; set; }

        public virtual string UOG_CREATEDBY { get; set; }

        public virtual DateTime? UOG_UPDATED { get; set; }

        public virtual string UOG_UPDATEDBY { get; set; }

        public virtual long UOG_RECORDVERSION { get; set; }
    }
}