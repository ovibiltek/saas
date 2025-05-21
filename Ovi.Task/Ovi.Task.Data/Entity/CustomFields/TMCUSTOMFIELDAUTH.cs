using System;

namespace Ovi.Task.Data.Entity.CustomFields
{
    public class TMCUSTOMFIELDAUTH
    {
        public virtual string CFA_ENTITY { get; set; }

        public virtual string CFA_TYPE { get; set; }

        public virtual string CFA_CODE { get; set; }

        public virtual string CFA_GROUP { get; set; }

        public virtual char CFA_OPTIONAL { get; set; }

        public virtual char CFA_REQUIRED { get; set; }

        public virtual char CFA_PROTECTED { get; set; }

        public virtual long CFA_SQLIDENTITY { get; set; }

        public virtual string CFA_CREATEDBY { get; set; }

        public virtual DateTime CFA_CREATED { get; set; }

        public virtual string CFA_UPDATEDBY { get; set; }

        public virtual DateTime? CFA_UPDATED { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMCUSTOMFIELDAUTH;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.CFA_TYPE == CFA_TYPE && other.CFA_CODE == CFA_CODE && other.CFA_GROUP == CFA_GROUP;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return CFA_TYPE.GetHashCode() ^ CFA_CODE.GetHashCode() ^ CFA_GROUP.GetHashCode();
            }
        }

        public virtual object Clone()
        {
            return MemberwiseClone();
        }
    }
}