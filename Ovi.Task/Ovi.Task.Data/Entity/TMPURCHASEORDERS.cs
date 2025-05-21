using System;

namespace Ovi.Task.Data.Entity
{
    public class TMPURCHASEORDERS
    {
        public virtual long POR_ID { get; set; }

        public virtual string POR_DESCRIPTION { get; set; }

        public virtual string POR_ORG { get; set; }

        public virtual string POR_TYPE { get; set; }

        public virtual string POR_TYPEENTITY { get; set; }

        public virtual string POR_STATUS { get; set; }

        public virtual string POR_STATUSDESC { get; set; }

        public virtual string POR_STATUSENTITY { get; set; }

        public virtual string POR_QUOTATIONDESC { get; set; }

        public virtual string POR_CANCELLATIONREASON { get; set; }

        public virtual string POR_WAREHOUSE { get; set; }

        public virtual string POR_REQUESTEDBY { get; set; }

        public virtual string POR_REQUESTEDBYEMAIL { get; set; }

        public virtual DateTime POR_REQUESTED { get; set; }

        public virtual string POR_SUPPLIER { get; set; }

        public virtual string POR_SUPPLIERDESC { get; set; }

        public virtual string POR_SUPPLIERAUTH { get; set; }

        public virtual string POR_SUPPLIERMAIL { get; set; }

        public virtual string POR_SUPPLIERPHONE { get; set; }

        public virtual string POR_SUPPLIERGSM { get; set; }

        public virtual string POR_SUPPLIERFAX { get; set; }

        public virtual string POR_SUPPLIERPROVIENCE { get; set; }

        public virtual string POR_SUPPLIERDISTRICT { get; set; }

        public virtual string POR_SUPPLIERADR { get; set; }

        public virtual string POR_SUPPAYMENTPERIOD { get; set; }

        public virtual int? POR_TASK { get; set; }

        public virtual string POR_CURRENCY { get; set; }

        public virtual string POR_ORGCURR { get; set; }

        public virtual string POR_PAYMENTTERM { get; set; }

        public virtual decimal POR_EXCHANGERATE { get; set; }

        public virtual decimal? POR_PARTTOTAL { get; set; }

        public virtual decimal? POR_TOTALTAXES { get; set; }

        public virtual string POR_DELIVERYADR { get; set; }

        public virtual string POR_CREATEDBY { get; set; }

        public virtual DateTime POR_CREATED { get; set; }

        public virtual string POR_UPDATEDBY { get; set; }

        public virtual DateTime? POR_UPDATED { get; set; }

        public virtual int POR_RECORDVERSION { get; set; }
    }
}