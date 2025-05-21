using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPRESALESVIEW
    {
        public virtual int PRS_ID { get; set; }
        public virtual string PRS_DESC { get; set; }
        public virtual string PRS_ORG { get; set; }
        public virtual string PRS_CUSTOMER { get; set; }
        public virtual string PRS_TYPE { get; set; }
        public virtual string PRS_TYPEENTITY { get; set; }

        public virtual string PRS_TYPEDESC { get; set; }
        public virtual string PRS_STATUS { get; set; }
        public virtual string PRS_STATUSENTITY { get; set; }
        public virtual string PRS_STATUSDESC { get; set; }
        public virtual string PRS_CONTACT { get; set; }
        public virtual string PRS_CONTACTMAIL { get; set; }
        public virtual string PRS_CONTACTPHONE  { get; set; }
        public virtual string PRS_RELATEDPERSON { get; set; }

        public virtual string PRS_RELATEDPERSONDESC { get; set; }
        public virtual decimal? PRS_QUOCOST { get; set; }
        public virtual decimal? PRS_QUOPROFITMARGIN { get; set; }
        public virtual decimal? PRS_QUOPROFIT { get; set; }
        public virtual int PRS_DOCCNT { get; set; }
        public virtual int PRS_CMNTCNT { get; set; }
        public virtual DateTime? PRS_ESTCLOSED { get; set; }
        public virtual DateTime? PRS_CLOSED { get; set; }
        public virtual decimal   PRS_SALESAMOUNT { get; set; }
        public virtual decimal? PRS_SALESPROFITMARGIN { get; set; }
        public virtual decimal? PRS_SALESPROFIT { get; set; }
        public virtual string PRS_REQUESTEDBY { get; set; }
        public virtual string PRS_REQUESTEDBYDESC { get; set; }
        public virtual DateTime PRS_CREATED { get; set; }
        public virtual string PRS_CREATEDBY { get; set; }
        public virtual DateTime? PRS_UPDATED { get; set; }
        public virtual string PRS_UPDATEDBY { get; set; }
        public virtual int PRS_RECORDVERSION { get; set; }

        public virtual int PRS_PROGRESS { get; set; }
        public virtual string PRS_QUOCURRENCY { get; set; }
        public virtual string PRS_SALECURRENCY { get; set; }
        public virtual string  PRS_CANCELLATIONREASON { get; set; }


    }
}
