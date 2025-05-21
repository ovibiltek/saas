using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSTOCK
    {
        public virtual long STK_PART { get; set; }

        public virtual string STK_WAREHOUSE { get; set; }

        public virtual string STK_BIN { get; set; }

        public virtual string STK_BINDESC { get; set; }

        public virtual decimal STK_QTY { get; set; }

        public virtual decimal STK_AVGPRICE { get; set; }

        public virtual long STK_SQLIDENTITY { get; set; }

        public virtual DateTime STK_CREATED { get; set; }

        public virtual string STK_CREATEDBY { get; set; }

        public virtual DateTime? STK_UPDATED { get; set; }

        public virtual string STK_UPDATEDBY { get; set; }

        public virtual int STK_RECORDVERSION { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMSTOCK;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.STK_PART == STK_PART && other.STK_WAREHOUSE == STK_WAREHOUSE && other.STK_BIN == STK_BIN;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return STK_PART.GetHashCode() ^ STK_WAREHOUSE.GetHashCode() ^ STK_BIN.GetHashCode();
            }
        }
    }
}