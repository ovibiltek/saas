using System;

namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TM_RPT_PROGRESSPAYMENT
    {
        public virtual long RPP_ID { get; set; }

        public virtual long RPP_PSP { get; set; }

        public virtual long RPP_TSK { get; set; }

        public virtual string RPP_TSKDESC { get; set; }

        public virtual string RPP_TSKTYPE { get; set; }

        public virtual string RPP_TSKTYPEDESC { get; set; }

        public virtual string RPP_TSKTASKTYPE { get; set; }

        public virtual string RPP_TSKCATEGORY { get; set; }

        public virtual string RPP_TSKCATDESC { get; set; }

        public virtual string RPP_PSPSTATUS { get; set; }

        public virtual string RPP_PSPSTATUSDESC { get; set; }

        public virtual string RPP_BRNAUTHORIZED { get; set; }

        public virtual string RPP_BRNTYPE { get; set; }

        public virtual DateTime RPP_TSKCOMPLETED { get; set; }

        public virtual DateTime RPP_TSKREQUESTED { get; set; }

        public virtual DateTime RPP_PSPCREATED { get; set; }

        public virtual string RPP_TSKCUSTOMER { get; set; }

        public virtual string RPP_TSKCUSTOMERDESC { get; set; }

        public virtual string RPP_TSKBRANCH { get; set; }

        public virtual string RPP_TSKBRANCHDESC { get; set; }

        public virtual string RPP_TSKBRANCHREFERENCE { get; set; }

        public virtual decimal RPP_TSKTOTAL { get; set; }

        public virtual string RPP_NOTE { get; set; }

        public virtual string RPP_TSKREFERENCE { get; set; }

        public virtual string RPP_PSPINVOICENO { get; set; }

        public virtual string RPP_PSPGROUP { get; set; }

        public virtual DateTime? RPP_PSPINVOICEDATE { get; set; }

        public virtual string RPP_TSKDURATIONSTR { get; set; }

        public virtual string RPP_TSKHOLDDURATIONSTR { get; set; }

        public virtual char RPP_HASQUOTATION { get; set; }

        public virtual string RPP_SHFTIP { get; set; }

        public virtual string RPP_SHHYIL { get; set; }

        public virtual string  RPP_SHHAY { get; set; }

        public virtual string RPP_SHFTIP_DESC { get; set; }

        public virtual string RPP_SHHYIL_DESC { get; set; }

        public virtual string RPP_SHHAY_DESC { get; set; }

    }
}