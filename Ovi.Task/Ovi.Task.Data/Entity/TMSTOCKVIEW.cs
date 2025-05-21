namespace Ovi.Task.Data.Entity
{
    public class TMSTOCKVIEW
    {
        public virtual long STK_ID { get; set; }

        public virtual int STK_PART { get; set; }

        public virtual string STK_PARTCODE { get; set; }

        public virtual string STK_PARTUOM { get; set; }

        public virtual string STK_PARTDESC { get; set; }

        public virtual string STK_WAREHOUSE { get; set; }

        public virtual string STK_WAREHOUSEDESC { get; set; }

        public virtual string STK_BIN { get; set; }

        public virtual string STK_BINDESC { get; set; }

        public virtual decimal STK_QTY { get; set; }

        public virtual decimal STK_AVGPRICE { get; set; }
    }}