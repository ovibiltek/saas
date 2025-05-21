using System;
namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TMPSPINVOICEDETAILSVIEW
    {
        public virtual int PSP_CODE { get; set; }
        public virtual string PSP_DESC { get; set; }
        public virtual decimal? PSP_TOTAL { get; set; }
        public virtual string PSP_CUSTOMER { get; set; }
        public virtual string PSP_CUSCONTACTPERSON { get; set; }
        public virtual DateTime? PSP_TSKCOMPLETED { get; set; }
        public virtual string PSP_COMPLETEDMY { get; set; }
        public virtual string PSP_CREATEDBY { get; set; }
        public virtual DateTime PSP_CREATED { get; set; }
        public virtual DateTime? PSP_LASTSIVDATE { get; set; }
        public virtual decimal? PSP_SALSALESTOTAL { get; set; }
        public virtual decimal? PSP_SALRETURNTOTAL { get; set; }
        public virtual decimal? PSP_SIVTOTAL { get; set; }
        public virtual int? PSP_LASTSIVID { get; set; }
        public virtual string PSP_LASTINVNO { get; set; }
        public virtual string PSP_LASTSIVTYPE { get; set; }
        public virtual int? PSP_SIVCOUNT { get; set; }
    }
}