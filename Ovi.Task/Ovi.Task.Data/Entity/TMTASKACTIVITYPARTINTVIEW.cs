namespace Ovi.Task.Data.Entity
{
    public class TMTASKACTIVITYPARTINTVIEW
    {
        public virtual int TPR_ID { get; set; }

        public virtual int TPR_TASK { get; set; }

        public virtual decimal? TPR_QTY { get; set; }

        public virtual decimal? TPR_UNITSALESPRICE { get; set; }

        public virtual string TPR_UOM { get; set; }

        public virtual string TPR_CURR { get; set; }

        public virtual string TPR_CUSTOMER { get; set; }

        public virtual string TPR_PARTREF { get; set; }
    }
}