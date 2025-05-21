using System;

namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TMPROGRESSPAYMENTS
    {
        public virtual long PSP_CODE { get; set; }

        public virtual string PSP_ORG { get; set; }

        public virtual string PSP_ORGCURR { get; set; }

        public virtual string PSP_TYPEENTITY { get; set; }

        public virtual string PSP_TYPE { get; set; }

        public virtual string PSP_DESC { get; set; }

        public virtual string PSP_CUSTOMER { get; set; }

        public virtual string PSP_CUSTOMERDESC { get; set; }

        public virtual string PSP_BRANCH { get; set; }

        public virtual string PSP_BRANCHDESC { get; set; }

        public virtual string PSP_STATUS { get; set; }

        public virtual string PSP_STATUSDESC { get; set; }

        public virtual string PSP_TASKTYPEENTITY { get; set; }

        public virtual string PSP_TASKTYPE { get; set; }

        public virtual string PSP_INVOICENO { get; set; }

        public virtual DateTime? PSP_INVOICEDATE { get; set; }

        public virtual string PSP_ALLOWZEROTOTAL { get; set; }

        public virtual DateTime PSP_CREATED { get; set; }

        public virtual string PSP_CREATEDBY { get; set; }

        public virtual DateTime? PSP_UPDATED { get; set; }

        public virtual string PSP_UPDATEDBY { get; set; }

        public virtual int PSP_RECORDVERSION { get; set; }

        public virtual int? PSP_GROUP { get; set; }

        public virtual DateTime? PSP_DATECLOSED { get; set; }

        public virtual decimal? PSP_TOTAL { get; set; }

        public virtual decimal? PSP_COST { get; set; }

        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}