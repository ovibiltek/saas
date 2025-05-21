using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERREQUISITIONLINES
    {
        public virtual long PQL_ID { get; set; }

        public virtual long PQL_REQ { get; set; }

        public virtual int PQL_LINE { get; set; }

        public virtual long PQL_PARTID { get; set; }

        public virtual string PQL_PARTCODE { get; set; }

        public virtual string PQL_PARTCURR { get; set; }

        public virtual string PQL_PARTNOTE { get; set; }

        public virtual string PQL_PARTDESC { get; set; }

        public virtual string PQL_PARUOM { get; set; }

        public virtual string PQL_REQUESTEDUOMDESC { get; set; }

        public virtual string PQL_POSTATUS { get; set; }

        public virtual decimal PQL_QUANTITY { get; set; }

        public virtual string PQL_REQUESTEDUOM { get; set; }

        public virtual decimal PQL_UOMMULTI { get; set; }

        public virtual DateTime PQL_REQUESTEDDATE { get; set; }

        public virtual decimal PQL_UNITPRICE { get; set; }

        public virtual string PQL_CURRENCY { get; set; }

        public virtual decimal PQL_EXCHANGERATE { get; set; }

        public virtual decimal PQL_VATTAX { get; set; }

        public virtual decimal PQL_TAX2 { get; set; }

        public virtual long? PQL_QUOTATION { get; set; }

        public virtual long? PQL_TASKACTIVITY { get; set; }

        public virtual long? PQL_TASK { get; set; }

        public virtual DateTime PQL_CREATED { get; set; }

        public virtual string PQL_CREATEDBY { get; set; }

        public virtual DateTime? PQL_UPDATED { get; set; }

        public virtual string PQL_UPDATEDBY { get; set; }

        public virtual int PQL_RECORDVERSION { get; set; }
    }

}
