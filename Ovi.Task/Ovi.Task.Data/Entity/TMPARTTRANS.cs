using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPARTTRANS
    {
        public virtual long PTR_ID { get; set; }

        public virtual string PTR_DESCRIPTION { get; set; }

        public virtual string PTR_TYPE { get; set; }

        public virtual string PTR_ORGANIZATION { get; set; }

        public virtual string PTR_ORGANIZATIONDESC { get; set; }

        public virtual DateTime PTR_TRANSACTIONDATE { get; set; }

        public virtual string PTR_WAREHOUSE { get; set; }

        public virtual string PTR_WAREHOUSEDESC { get; set; }

        public virtual string PTR_STATUS { get; set; }

        public virtual string PTR_INTREF { get; set; }

        public virtual DateTime PTR_CREATED { get; set; }

        public virtual string PTR_CREATEDBY { get; set; }

        public virtual string PTR_CREATEDBYDESC { get; set; }

        public virtual DateTime? PTR_UPDATED { get; set; }

        public virtual string PTR_UPDATEDBY { get; set; }

        public virtual int PTR_RECORDVERSION { get; set; }
    }
}