using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERLINEVIEW
    {
        public virtual long POL_ID { get; set; }

        public virtual int POL_PORID { get; set; }

        public virtual int POL_LINE { get; set; }

        public virtual int POL_PART { get; set; }

        public virtual string POL_PARTCODE { get; set; }

        public virtual string POL_PARTDESC { get; set; }

        public virtual string POL_PARTUOM { get; set; }

        public virtual decimal POL_QUANTITY { get; set; }

        public virtual string POL_REQUESTEDUOM { get; set; }

        public virtual decimal POL_UOMMULTI { get; set; }

        public virtual DateTime POL_REQUESTEDDATE { get; set; }

        public virtual decimal POL_UNITPRICE { get; set; }

        public virtual string POL_CURRENCY { get; set; }

        public virtual decimal POL_EXCHANGERATE { get; set; }

        public virtual decimal POL_VATTAX { get; set; }

        public virtual decimal POL_TAX2 { get; set; }

        public virtual DateTime POL_CREATED { get; set; }

        public virtual string POL_CREATEDBY { get; set; }

        public virtual DateTime POL_UPDATED { get; set; }

        public virtual string POL_UPDATEDBY { get; set; }

        public virtual int POL_RECORDVERSION { get; set; }

        public virtual string POL_DESC { get; set; }

        public virtual string POL_ORG { get; set; }

        public virtual string POL_ORGDESC { get; set; }

        public virtual string POL_TYPE { get; set; }

        public virtual string POL_STATUS { get; set; }

        public virtual string POL_QUATATION { get; set; }

        public virtual string POL_QUODESC { get; set; }

        public virtual string POL_WAREHOUSE { get; set; }

        public virtual string POL_REQUESTEDBY { get; set; }

        public virtual string POL_SUPPLIER { get; set; }

        public virtual string POL_PORCURR { get; set; }

        public virtual decimal POL_POREXCH { get; set; }

        public virtual DateTime POL_PORCREATED { get; set; }

        public virtual string POL_PORCREATEDBY { get; set; }

        public virtual DateTime POL_PORUPDATED { get; set; }

        public virtual string POL_PORUPDATEDBY { get; set; }

        public virtual int POL_PORRECORDVER { get; set; }

        public virtual int? POL_TASK { get; set; }

        public virtual int? POL_TASKACTIVITY { get; set; }

        public virtual int? POL_QUOTATION { get; set; }

        public virtual int? POL_WAITINGQUANTITY { get; set; }

        public virtual int? POL_REQLINEID { get; set; }

        public virtual int? POL_REQ { get; set; }

    }
}