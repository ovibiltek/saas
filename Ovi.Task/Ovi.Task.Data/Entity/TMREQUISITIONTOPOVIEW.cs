namespace Ovi.Task.Data.Entity
{
    public class TMREQUISITIONTOPOVIEW
    {
        public virtual long PQC_ID { get; set; }

        public virtual long PQC_HID { get; set; }

        public virtual string PQC_HDESC { get; set; }

        public virtual string PQC_HORG { get; set; }

        public virtual string PQC_HTYPEENTITY { get; set; }

        public virtual string PQC_HTYPE { get; set; }

        public virtual string PQC_HSTATUS { get; set; }

        public virtual string PQC_HSTATUSDESC { get; set; }

        public virtual string PQC_HADR { get; set; }

        public virtual string PQC_HSTATUSENTITY { get; set; }

        public virtual int? PQC_HQUOTATION { get; set; }

        public virtual int? PQC_HTASK { get; set; }

        public virtual int? PQC_HTASKACTIVITY { get; set; }

        public virtual int PQC_LLINE { get; set; }

        public virtual string PQC_HSUPPLIER { get; set; }

        public virtual string PQC_HSUPDESC { get; set; }

        public virtual string PQC_HWAREHOUSE { get; set; }

        public virtual string PQC_HREQUESTEDBY { get; set; }

        public virtual string PQC_LPARTCODE { get; set; }

        public virtual string PQC_LPARTDESC { get; set; }

        public virtual string PQC_LTYPE { get; set; }

        public virtual string PQC_LTYPEDESC { get; set; }

        public virtual string PQC_LPARTNOTE { get; set; }

        public virtual string PQC_LUOM { get; set; }

        public virtual string PQC_LREQUOM { get; set; }

        public virtual decimal PQC_LQUANTITY { get; set; }

        public virtual decimal PQC_LUNITPRICE { get; set; }

        public virtual decimal PQC_TOTALPRICE { get; set; }

        public virtual string PQC_LCURRENCY { get; set; }

        public virtual decimal PQC_LVATTAX { get; set; }

        public virtual decimal PQC_LTAX2 { get; set; }

        public virtual string PQC_CUSTOMERCODE { get; set; }

        public virtual string PQC_REGION { get; set; }
    }
}