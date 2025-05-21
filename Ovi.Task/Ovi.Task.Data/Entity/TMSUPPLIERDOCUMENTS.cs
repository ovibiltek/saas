using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSUPPLIERDOCUMENTS
    {
        public virtual int SDC_ID { get; set; }

        public virtual string SDC_SUPPLIER { get; set; }

        public virtual string SDC_DOCUMENTTYPE { get; set; }

        public virtual string SDC_DOCUMENTTYPEDESC { get; set; }

        public virtual string SDC_DESCRIPTION { get; set; }

        public virtual DateTime SDC_STARTDATE { get; set; }

        public virtual DateTime SDC_ENDDATE { get; set; }

        public virtual DateTime SDC_CREATED { get; set; }

        public virtual string SDC_CREATEDBY { get; set; }

        public virtual DateTime? SDC_UPDATED { get; set; }

        public virtual string SDC_UPDATEDBY { get; set; }

        public virtual int SDC_RECORDVERSION { get; set; }
    }
}