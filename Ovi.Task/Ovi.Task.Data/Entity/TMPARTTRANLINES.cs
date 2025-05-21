using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPARTTRANLINES
    {
        public virtual long PTL_ID { get; set; }

        public virtual long PTL_TRANSACTION { get; set; }

        public virtual string PTL_TRANSACTIONDESC { get; set; }

        public virtual long PTL_LINE { get; set; }

        public virtual DateTime PTL_TRANSACTIONDATE { get; set; }

        public virtual long PTL_PART { get; set; }

        public virtual string PTL_PARTCODE { get; set; }

        public virtual string PTL_PARTDESC { get; set; }

        public virtual string PTL_TYPE { get; set; }

        public virtual long? PTL_TASK { get; set; }

        public virtual string PTL_TASKDESC { get; set; }

        public virtual string PTL_TASKEQPCODE { get; set; }

        public virtual string PTL_TASKEQPDESC { get; set; }

        public virtual string PTL_TASKCUSTOMER { get; set; }

        public virtual string PTL_TASKCUSTOMERDESC { get; set; }

        public virtual string PTL_TASKBRANCH { get; set; }

        public virtual string PTL_TASKBRANCHDESC { get; set; }

        public virtual string PTL_TASKCATEGORY { get; set; }

        public virtual long? PTL_ACTIVITY { get; set; }

        public virtual string PTL_WAREHOUSE { get; set; }

        public virtual string PTL_WAREHOUSEDESC { get; set; }

        public virtual string PTL_BIN { get; set; }

        public virtual string PTL_BINDESC { get; set; }

        public virtual decimal PTL_PRICE { get; set; }

        public virtual decimal PTL_QTY { get; set; }

        public virtual string PTL_WAYBILL { get; set; }

        public virtual DateTime PTL_CREATED { get; set; }

        public virtual string PTL_CREATEDBY { get; set; }

        public virtual int PTL_RECORDVERSION { get; set; }

        public virtual long? PTL_PURCHASEORDER { get; set; }

        public virtual long? PTL_PURCHASEORDERLINE { get; set; }

        public virtual string PTL_PARTREFERENCE { get; set; }

        public virtual string PTL_TRANSTATUS { get; set; }

    }
}