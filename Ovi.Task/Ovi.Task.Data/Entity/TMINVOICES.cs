using System;

namespace Ovi.Task.Data.Entity
{
    public class TMINVOICES
    {
        public virtual long INV_CODE { get; set; }

        public virtual string INV_DESC { get; set; }

        public virtual string INV_ORG { get; set; }

        public virtual string INV_ORGDESC { get; set; }

        public virtual string INV_ORGCURR { get; set; }

        public virtual string INV_TYPEENTITY { get; set; }

        public virtual string INV_TYPE { get; set; }

        public virtual string INV_TYPEDESC { get; set; }

        public virtual string INV_STATUSENTITY { get; set; }

        public virtual string INV_STATUS { get; set; }

        public virtual string INV_PSTATUS { get; set; }

        public virtual string INV_STATUSDESC { get; set; }

        public virtual string INV_SUPPLIER { get; set; }

        public virtual string INV_SUPPLIERDESC { get; set; }

        public virtual string INV_SUPPLIERACCOUNT { get; set; }

        public virtual string INV_PAYMENTPERIOD { get; set; }

        public virtual DateTime? INV_STARTDATE { get; set; }

        public virtual DateTime? INV_ENDDATE { get; set; }

        public virtual string INV_TSKCATEGORY { get; set; }

        public virtual string INV_TSKCATEGORYDESC { get; set; }

        public virtual string INV_CUSTOMER { get; set; }

        public virtual string INV_CUSTOMERDESC { get; set; }

        public virtual string INV_INVOICE { get; set; }

        public virtual DateTime? INV_INVOICEDATE { get; set; }

        public virtual DateTime INV_CREATED { get; set; }

        public virtual string INV_CREATEDBY { get; set; }

        public virtual DateTime? INV_UPDATED { get; set; }

        public virtual string INV_UPDATEDBY { get; set; }

        public virtual int INV_RECORDVERSION { get; set; }

        public virtual decimal? INV_MATCHEDTOTAL { get; set; }

        public virtual decimal? INV_TOTAL { get; set; }

        public virtual decimal? INV_TOTALWITHINTEREST { get; set; }

        public virtual string INV_RETURNINVOICE { get; set; }

        public virtual int? INV_ORDERNO { get; set; }

        public virtual string INV_ORDERNODESC { get; set; }

        public virtual char INV_INTEREST { get; set; }

        public virtual char INV_TFS { get; set; }


    }
}