using System;

namespace Ovi.Task.Data.Entity
{
    public class TMSYSCODES
    {
        public virtual string SYC_CODE { get; set; }

        public virtual string SYC_DESCRIPTION { get; set; }

        public virtual string SYC_DESCF { get; set; }

        public virtual string SYC_GROUP { get; set; }

        public virtual string SYC_GROUPDESC { get; set; }

        public virtual int? SYC_ORDER { get; set; }


        public virtual char SYC_ACTIVE { get; set; }

        public virtual DateTime SYC_CREATED { get; set; }

        public virtual string SYC_CREATEDBY { get; set; }

        public virtual DateTime? SYC_UPDATED { get; set; }

        public virtual string SYC_UPDATEDBY { get; set; }

        public virtual string SYC_PARENT { get; set; }

        public virtual string SYC_PARENTGROUP { get; set; }

        public virtual string SYC_PARENTDESC { get; set; }

        public virtual int SYC_RECORDVERSION { get; set; }

        public virtual int SYC_SQLIDENTITY { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMSYSCODES;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.SYC_CODE == SYC_CODE && other.SYC_GROUP == SYC_GROUP;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return SYC_GROUP.GetHashCode() ^ SYC_CODE.GetHashCode();
            }
        }

    }
}