using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERREQUISITIONS
    {
        public virtual long PRQ_ID { get; set; }

        public virtual string PRQ_DESCRIPTION { get; set; }

        public virtual string PRQ_ORG { get; set; }

        public virtual string PRQ_TYPEENTITY { get; set; }

        public virtual string PRQ_TYPE { get; set; }

        public virtual string PRQ_STATUS { get; set; }

        public virtual string PRQ_STATUSENTITY { get; set; }

        public virtual string PRQ_STATUSDESC { get; set; }

        public virtual long? PRQ_QUOTATION { get; set; }

        public virtual long? PRQ_TASK { get; set; }

        public virtual string PRQ_TASKBRANCH { get; set; }

        public virtual string PRQ_TASKREGION { get; set; }

        public virtual long? PRQ_TASKACTIVITY { get; set; }

        public virtual string PRQ_REQDELADR { get; set; }

        public virtual string PRQ_REQDELADRTYPE { get; set; }

        public virtual string PRQ_CANCELLATIONREASON { get; set; }

        public virtual string PRQ_WAREHOUSE { get; set; }

        public virtual string PRQ_REQUESTEDBY { get; set; }

        public virtual DateTime PRQ_REQUESTED { get; set; }

        public virtual string PRQ_SUPPLIER { get; set; }

        public virtual string PRQ_SUPPLIERDESC { get; set; }

        public virtual string PRQ_CURRENCY { get; set; }

        public virtual string PRQ_ORGCURR { get; set; }

        public virtual decimal PRQ_EXCHANGERATE { get; set; }

        public virtual DateTime PRQ_CREATED { get; set; }

        public virtual string PRQ_CREATEDBY { get; set; }

        public virtual DateTime? PRQ_UPDATED { get; set; }

        public virtual string PRQ_UPDATEDBY { get; set; }

        public virtual long PRQ_RECORDVERSION { get; set; }

        public virtual string PRQ_REQDELPHONENUMBER { get; set; }
        public virtual string PRQ_REQDELRELATEDPERSON { get; set; }
    }
}