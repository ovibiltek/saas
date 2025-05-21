namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONLINEDETAILSVIEW
    {
        public virtual long QLN_ID { get; set; }

        public virtual int QLN_QUOTATION { get; set; }

        public virtual string QLN_QUODESC { get; set; }

        public virtual string QLN_QUOORG { get; set; }

        public virtual string QLN_QUOCUSTOMER { get; set; }

        public virtual string QLN_QUOTYPE { get; set; }

        public virtual string QLN_QUOSUPPLIER { get; set; }

        public virtual string QLN_QUOSTATUS { get; set; }

        public virtual string QLN_STADESC { get; set; }

        public virtual int? QLN_QUOTASK { get; set; }

        public virtual string QLN_TSKCATEGORY { get; set; }

        public virtual string QLN_CATDESC { get; set; }

        public virtual string QLN_TYPE { get; set; }

        public virtual string QLN_SUBTYPE { get; set; }

        public virtual int? QLN_CODE { get; set; }

        public virtual string QLN_DESCRIPTION { get; set; }

        public virtual decimal QLN_QUANTITY { get; set; }

        public virtual string QLN_UOM { get; set; }

        public virtual decimal? QLN_UNITPURCHASEPRICE { get; set; }

        public virtual string QLN_PURCHASECURR { get; set; }

        public virtual decimal? QLN_UNITSALESPRICE { get; set; }

        public virtual string QLN_CURR { get; set; }
    }
}