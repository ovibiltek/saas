using System;

namespace Ovi.Task.Data.Entity
{
    public class TMMOBILEDRAWINGS
    {
        public virtual int DRW_TASK { get; set; }
        public virtual int DRW_ACTIVITY { get; set; }
        public virtual string DRW_NOTES { get; set; }
        public virtual string DRW_DATA { get; set; }
        public virtual DateTime DRW_CREATED { get; set; }
        public virtual string DRW_CREATEDBY { get; set; }
        public virtual int DRW_RECORDVERSION { get; set; }
        public override int GetHashCode()
        {
            var hashCode = 0;
            hashCode = hashCode ^ DRW_ACTIVITY.GetHashCode();
            hashCode = hashCode ^ DRW_TASK.GetHashCode();
            return hashCode;
        }

        public override bool Equals(object obj)
        {
            var toCompare = obj as TMMOBILEDRAWINGS;
            if (toCompare == null)
                return false;
            return (GetHashCode() != toCompare.GetHashCode());
        }
    }
}