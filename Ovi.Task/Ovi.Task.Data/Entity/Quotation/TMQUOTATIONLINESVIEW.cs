namespace Ovi.Task.Data.Entity.Quotation
{
    public class TMQUOTATIONLINESVIEW
    {
        public virtual long? QLN_NO { get; set; }

        public virtual long QLN_LINEID { get; set; }

        public virtual long QLN_SERVICECODE { get; set; }

        public virtual long QLN_PARTCODE { get; set; }

        public virtual decimal QLN_QUOEXCH { get; set; }

        public virtual string QLN_BRAND { get; set; }

        public virtual string QLN_ORGANIZATION { get; set; }

        public virtual string QLN_SUPPLIER { get; set; }

        public virtual string QLN_TYPE { get; set; }

        public virtual string QLN_SUBTYPE { get; set; }

        public virtual string QLN_DESCRIPTION { get; set; }

        public virtual int QLN_QUOTATION { get; set; }

        public virtual string QLN_UOM { get; set; }

        public virtual decimal QLN_QUANTITY { get; set; }

        public virtual decimal? QLN_UNITPURCHASEPRICE { get; set; }

        public virtual string QLN_PURCHASECURR { get; set; }

        public virtual string QLN_PURCHASECURRDESC { get; set; }

        public virtual decimal? QLN_UNITPRICE { get; set; }

        public virtual decimal? QLN_UNITSALESPRICE { get; set; }

        public virtual decimal? QLN_TOTALPRICE { get; set; }

        public virtual decimal? QLN_PURCHASEEXCH { get; set; }

        public virtual decimal? QLN_EXCH { get; set; }

        public virtual string QLN_CURR { get; set; }

        public virtual string QLN_CURRDESC { get; set; }

        public virtual decimal? QLN_SALESDISCOUNTRATE { get; set; }

        public virtual int QLN_RECORDVERSION { get; set; }

        public virtual string QLN_REFERENCE { get; set; }

        public virtual char QLN_COPY { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMQUOTATIONLINESVIEW;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.QLN_QUOTATION == QLN_QUOTATION && other.QLN_NO == QLN_NO;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return QLN_QUOTATION.GetHashCode() ^ QLN_NO.GetHashCode();
            }
        }
    }
}