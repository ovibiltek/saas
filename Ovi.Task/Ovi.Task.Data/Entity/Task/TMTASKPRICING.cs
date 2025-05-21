namespace Ovi.Task.Data.Entity.Task
{
    public class TMTASKPRICING
    {
        public virtual int TPR_ID { get; set; }

        public virtual int? TPR_TASK { get; set; }

        public virtual int? TPR_ACTIVITY { get; set; }

        public virtual string TPR_TYPECODE { get; set; }

        public virtual string TPR_TYPE { get; set; }

        public virtual string TPR_CODE { get; set; }

        public virtual string TPR_DESC { get; set; }

        public virtual string TPR_UOM { get; set; }

        public virtual decimal TPR_QTY { get; set; }

        public virtual decimal? TPR_UNITPRICE { get; set; }

        public virtual decimal? TPR_TOTALPRICE { get; set; }

        public virtual decimal? TPR_UNITSALESPRICE { get; set; }

        public virtual decimal? TPR_TOTALSALESPRICE { get; set; }

        public virtual char TPR_ALLOWZERO { get; set; }

        public virtual string TPR_CURR { get; set; }

        public virtual string TPR_PRICINGMETHOD { get; set; }

        public virtual decimal TPR_EXCH { get; set; }

        public virtual int? TPR_RECORDID { get; set; }

    }
}