using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCANCELLATIONREASONS
    {
        public virtual string CNR_ENTITY { get; set; }

        public virtual string CNR_CODE { get; set; }

        public virtual string CNR_DESC { get; set; }

        public virtual string CNR_DESCF { get; set; }

        public virtual char CNR_ACTIVE { get; set; }

        public virtual DateTime CNR_CREATED { get; set; }

        public virtual string CNR_CREATEDBY { get; set; }

        public virtual DateTime? CNR_UPDATED { get; set; }

        public virtual string CNR_UPDATEDBY { get; set; }

        public virtual int CNR_RECORDVERSION { get; set; }

        public virtual int CNR_SQLIDENTITY { get; set; }

        public override int GetHashCode()
        {
            var hashCode = 0;
            hashCode = hashCode ^ CNR_CODE.GetHashCode();
            hashCode = hashCode ^ CNR_ENTITY.GetHashCode();
            return hashCode;
        }

        public override bool Equals(object obj)
        {
            var toCompare = obj as TMCANCELLATIONREASONS;
            if (toCompare == null)
            {
                return false;
            }

            return (GetHashCode() != toCompare.GetHashCode());
        }
    }
}