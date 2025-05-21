using System;

namespace Ovi.Task.Data.Entity
{
    public class TMTYPES
    {
        public virtual string TYP_ENTITY { get; set; }

        public virtual string TYP_CODE { get; set; }

        public virtual string TYP_DESC { get; set; }

        public virtual string TYP_DESCF { get; set; }

        public virtual string TYP_ORGANIZATION { get; set; }

        public virtual string TYP_ORGANIZATIONDESC { get; set; }

        public virtual string TYP_AUTOCODEPREFIX { get; set; }

        public virtual char TYP_ACTIVE { get; set; }

        public virtual char TYP_SHOWINACTIONBOX { get; set; }

        public virtual long TYP_SQLIDENTITY { get; set; }

        public virtual DateTime TYP_CREATED { get; set; }

        public virtual string TYP_CREATEDBY { get; set; }

        public virtual DateTime? TYP_UPDATED { get; set; }

        public virtual string TYP_UPDATEDBY { get; set; }

        public virtual int TYP_RECORDVERSION { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMTYPES;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TYP_ENTITY == TYP_ENTITY && other.TYP_CODE == TYP_CODE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return TYP_ENTITY.GetHashCode() ^ TYP_CODE.GetHashCode();
            }
        }
    }
}