using System;

namespace Ovi.Task.Data.Entity
{
    public class TMBINS
    {
        public virtual string BIN_CODE { get; set; }

        public virtual string BIN_DESC { get; set; }

        public virtual string BIN_WAREHOUSE { get; set; }

        public virtual char BIN_ACTIVE { get; set; }

        public virtual long BIN_SQLIDENTITY { get; set; }

        public virtual DateTime BIN_CREATED { get; set; }

        public virtual string BIN_CREATEDBY { get; set; }

        public virtual DateTime? BIN_UPDATED { get; set; }

        public virtual string BIN_UPDATEDBY { get; set; }

        public virtual int BIN_RECORDVERSION { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMBINS;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.BIN_CODE == BIN_CODE && other.BIN_WAREHOUSE == BIN_WAREHOUSE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return BIN_CODE.GetHashCode() ^ BIN_WAREHOUSE.GetHashCode();
            }
        }
    }
}