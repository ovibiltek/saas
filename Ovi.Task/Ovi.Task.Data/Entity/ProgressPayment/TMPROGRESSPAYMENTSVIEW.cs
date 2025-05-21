using System;

namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TMPROGRESSPAYMENTSVIEW
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

        public virtual string PSP_BRANCHREFERENCE { get; set; }

        public virtual string PSP_STATUS { get; set; }

        public virtual string PSP_STATUSDESC { get; set; }

        public virtual string PSP_TASKTYPEENTITY { get; set; }

        public virtual string PSP_TASKTYPE { get; set; }

        public virtual string PSP_CATEGORY { get; set; }

        public virtual string PSP_CATEGORYDESC { get; set; }

        public virtual DateTime PSP_CREATED { get; set; }

        public virtual string PSP_CREATEDBY { get; set; }

        public virtual DateTime? PSP_UPDATED { get; set; }

        public virtual string PSP_UPDATEDBY { get; set; }

        public virtual int PSP_RECORDVERSION { get; set; }

        public virtual int? PSP_SLSINVOICE { get; set; }

        public virtual decimal PSP_TOTAL { get; set; }

        public virtual decimal PSP_COST { get; set; }

        public virtual decimal PSP_PROFIT { get; set; }

        public virtual string PSP_TSKTYPEDESC { get; set; }

        public virtual string PSP_CUSTOMERPM { get; set; }

        public virtual string PSP_BRANCHPM { get; set; }

        public virtual string PSP_BRANCHREGION { get; set; }

        public virtual string PSP_BRANCHAUTHNOTES{ get; set; }

        public virtual string PSP_TSKDEPARTMENT { get; set; }

        public virtual string PSP_TSKTASKTYPE { get; set; }

        public virtual string PSP_TSKREFERENCE { get; set; }

        public virtual DateTime? PSP_TSKCOMPLETED { get; set; }

        public virtual DateTime? PSP_TSKCLOSED { get; set; }

        public virtual string PSP_INVOICENO { get; set; }

        public virtual DateTime? PSP_INVOICEDATE { get; set; }

        public virtual DateTime? PSP_DATECLOSED { get; set; }

        public virtual int? PSP_GROUP { get; set; }

        public virtual string PSP_BRANCHTYPE { get; set; }

        public virtual string PSP_CUSTOMERGROUP { get; set; }

        public virtual string PSP_CUSTOMERPSP { get; set; }

        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}