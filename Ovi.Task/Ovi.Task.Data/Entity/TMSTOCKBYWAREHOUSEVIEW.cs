namespace Ovi.Task.Data.Entity
{
    public class TMSTOCKBYWAREHOUSEVIEW
    {
        public virtual long STK_PART { get; set; }

        public virtual string STK_PARTCODE { get; set; }

        public virtual string STK_PARTORG { get; set; }

        public virtual string STK_PARTDESC { get; set; }

        public virtual string STK_PARTUOM { get; set; }

        public virtual string STK_PARTUOMDESC { get; set; }

        public virtual decimal STK_PARTAVGPRICE { get; set; }

        public virtual string STK_WAREHOUSE { get; set; }

        public virtual string STK_WAREHOUSEDESC { get; set; }

        public virtual decimal STK_WHQTY { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMSTOCKBYWAREHOUSEVIEW;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.STK_PART == STK_PART && other.STK_WAREHOUSE == STK_WAREHOUSE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return STK_PART.GetHashCode() ^ STK_WAREHOUSE.GetHashCode();
            }
        }
    }
}