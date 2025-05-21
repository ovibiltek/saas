using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSTATUSES
    {
        public virtual string STA_CODE { get; set; }

        public virtual string STA_PCODE { get; set; }

        public virtual string STA_DESC { get; set; }

        public virtual string STA_DESCF { get; set; }

        public virtual string STA_ENTITY { get; set; }

        public virtual string STA_CSS { get; set; }

        public virtual char STA_SHOWONSEARCH { get; set; }

        public virtual char STA_APPROVALSTEP { get; set; }

        public virtual char STA_NEWAPPOINTMENT { get; set; }

        public virtual char STA_PROGRESSPAYMENT { get; set; }

        public virtual int? STA_ORDER { get; set; }

        public virtual long STA_SQLIDENTITY { get; set; }

        public virtual DateTime STA_CREATED { get; set; }

        public virtual string STA_CREATEDBY { get; set; }

        public virtual DateTime? STA_UPDATED { get; set; }

        public virtual string STA_UPDATEDBY { get; set; }

        public virtual int STA_RECORDVERSION { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMSTATUSES;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.STA_ENTITY == STA_ENTITY && other.STA_CODE == STA_CODE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return STA_ENTITY.GetHashCode() ^ STA_CODE.GetHashCode();
            }
        }
    }
}