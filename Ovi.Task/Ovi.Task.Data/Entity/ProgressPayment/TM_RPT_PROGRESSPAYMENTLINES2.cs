namespace Ovi.Task.Data.Entity.ProgressPayment
{
    public class TM_RPT_PROGRESSPAYMENTLINES2
    {
        public virtual int PRC_ID { get; set; }

        public virtual int PRC_TASK { get; set; }

        public virtual int PRC_ACTLINE { get; set; }

        public virtual string PRC_ACTDESC { get; set; }

        public virtual string PRC_ACTNOTE { get; set; }

        public virtual decimal? PRC_UNITPRICE { get; set; }

        public virtual string PRC_UOM { get; set; }

        public virtual decimal? PRC_QTY { get; set; }

        public virtual string PRC_TYPE { get; set; }

        public virtual string PRC_SUBTYPE { get; set; }

        public virtual string PRC_TYPEDESC { get; set; }

        public virtual char PRC_HASQUOTATION { get; set; }

        public virtual string PRC_MAILRECIPIENTS { get; set; }

    }
}