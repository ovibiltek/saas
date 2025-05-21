using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCONTRACTS
    {
        public virtual int CON_ID { get; set; }

        public virtual string CON_ORGANIZATION { get; set; }

        public virtual string CON_ORGANIZATIONDESC { get; set; }

        public virtual string CON_DESC { get; set; }

        public virtual string CON_DETAILS { get; set; }

        public virtual string CON_REFERENCE { get; set; }

        public virtual string CON_TYPEENTITY { get; set; }

        public virtual string CON_TYPE { get; set; }

        public virtual string CON_TYPEDESC { get; set; }

        public virtual string CON_CUSTOMER { get; set; }

        public virtual string CON_CUSTOMERDESC { get; set; }

        public virtual string CON_SUPPLIER { get; set; }

        public virtual string CON_SUPPLIERDESC { get; set; }

        public virtual string CON_MANAGER { get; set; }

        public virtual string CON_MANAGERDESC { get; set; }

        public virtual DateTime CON_STARTDATE { get; set; }

        public virtual DateTime CON_ENDDATE { get; set; }

        public virtual int? CON_REMINDINGPERIOD { get; set; }

        public virtual string CON_STATUSENTITY { get; set; }

        public virtual string CON_STATUS { get; set; }

        public virtual string CON_STATUSDESC { get; set; }

        public virtual string CON_CANCELLATIONREASON { get; set; }

        public virtual string CON_CANCELLATIONREASONDESC { get; set; }

        public virtual int? CON_PAYMENTDUE { get; set; }

        public virtual int CON_RECORDVERSION { get; set; }

        public virtual DateTime CON_CREATED { get; set; }

        public virtual string CON_CREATEDBY { get; set; }

        public virtual DateTime? CON_UPDATED { get; set; }

        public virtual string CON_UPDATEDBY { get; set; }
    }
}