using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSALESINVOICES
    {
        public virtual int SIV_CODE { get; set; }

        public virtual string SIV_ORG { get; set; }

        public virtual string SIV_ORGDESC { get; set; }

        public virtual string SIV_TYPEENTITY { get; set; }

        public virtual string SIV_TYPE { get; set; }

        public virtual string SIV_TYPEDESC { get; set; }

        public virtual string SIV_SALESINVOICE { get; set; }

        public virtual string SIV_DESC { get; set; }

        public virtual string SIV_STATUSENTITY { get; set; }

        public virtual string SIV_STATUS { get; set; }

        public virtual string SIV_PSTATUS { get; set; }

        public virtual string SIV_STATUSDESC { get; set; }

        public virtual string SIV_CUSTOMER { get; set; }

        public virtual string SIV_CUSTOMERDESC { get; set; }

        public virtual string SIV_BRANCH { get; set; }

        public virtual string SIV_BRANCHDESC { get; set; }

        public virtual string SIV_ACCOUNTCODE { get; set; }

        public virtual string SIV_ORDERNO { get; set; }

        public virtual string SIV_PSPTYPEENTITY { get; set; }

        public virtual string SIV_PSPTYPE { get; set; }

        public virtual string SIV_PSPTYPEDESC { get; set; }

        public virtual string SIV_RETURNCAUSE { get; set; }

        public virtual string SIV_RETURNCAUSEENTITY { get; set; }

        public virtual string SIV_RETURNCAUSEDESC { get; set; }

        public virtual decimal? SIV_TOTAL { get; set; }

        public virtual DateTime? SIV_PSPCREATEDSTART { get; set; }

        public virtual DateTime? SIV_PSPCREATEDEND { get; set; }

        public virtual string SIV_INVOICENO { get; set; }

        public virtual string SIV_INVOICEDESCRIPTION { get; set; }

        public virtual string SIV_CUSTOMERPM { get; set; }

        public virtual int? SIV_CUSPAYMENTPERIOD { get; set; }

        public virtual string SIV_BRANCHPM { get; set; }

        public virtual DateTime? SIV_INVOICEDATE { get; set; }

        public virtual string SIV_PRINTTYPE { get; set; }

        public virtual char SIV_INTEREST { get; set; }

        public virtual DateTime SIV_CREATED { get; set; }

        public virtual string SIV_CREATEDBY { get; set; }

        public virtual DateTime? SIV_UPDATED { get; set; }

        public virtual string SIV_UPDATEDBY { get; set; }

        public virtual int SIV_RECORDVERSION { get; set; }
    }
}