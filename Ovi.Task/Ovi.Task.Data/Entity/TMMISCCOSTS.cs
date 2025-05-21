using System;

namespace Ovi.Task.Data.Entity
{
    public class TMMISCCOSTS
    {
        public virtual long MSC_ID { get; set; }

        public virtual long MSC_TASK { get; set; }

        public virtual long MSC_ACTIVITY { get; set; }

        public virtual string MSC_ACTIVITYDESC { get; set; }

        public virtual DateTime MSC_DATE { get; set; }

        public virtual string MSC_DESC { get; set; }

        public virtual string MSC_TYPE { get; set; }

        public virtual string MSC_TYPEDESC { get; set; }

        public virtual string MSC_PTYPE { get; set; }

        public virtual decimal MSC_UNITPRICE { get; set; }

        public virtual decimal? MSC_UNITSALESPRICE { get; set; }

        public virtual string MSC_CURR { get; set; }

        public virtual decimal MSC_EXCH { get; set; }

        public virtual string MSC_CURRDESC { get; set; }

        public virtual decimal MSC_QTY { get; set; }

        public virtual string MSC_UOM { get; set; }

        public virtual string MSC_UOMDESC { get; set; }

        public virtual decimal MSC_TOTAL { get; set; }

        public virtual long? MSC_INVOICE { get; set; }

        public virtual string MSC_INVOICEDESC { get; set; }

        public virtual int? MSC_PART { get; set; }

        public virtual string MSC_PARTCODE { get; set; }

        public virtual string MSC_PARTDESC { get; set; }

        public virtual string MSC_PARTREFERENCE { get; set; }

        public virtual  char MSC_FIXED { get; set; }

        public virtual DateTime MSC_CREATED { get; set; }

        public virtual string MSC_CREATEDBY { get; set; }

        public virtual DateTime? MSC_UPDATED { get; set; }

        public virtual string MSC_UPDATEDBY { get; set; }

        public virtual int MSC_RECORDVERSION { get; set; }
    }
}