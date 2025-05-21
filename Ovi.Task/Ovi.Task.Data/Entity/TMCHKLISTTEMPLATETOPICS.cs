using System;

namespace Ovi.Task.Data.Entity
{
    public class TMCHKLISTTEMPLATETOPICS
    {
        public virtual string CHT_CODE { get; set; }

        public virtual string CHT_DESCRIPTION { get; set; }

        public virtual string CHT_TEMPLATE { get; set; }

        public virtual char CHT_ACTIVE { get; set; }

        public virtual char CHT_ALLOWNEWLINE { get; set; }

        public virtual int CHT_SQLIDENTITY { get; set; }

        public virtual DateTime CHT_CREATED { get; set; }

        public virtual string CHT_CREATEDBY { get; set; }

        public virtual DateTime? CHT_UPDATED { get; set; }

        public virtual string CHT_UPDATEDBY { get; set; }

        public virtual int CHT_RECORDVERSION { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMCHKLISTTEMPLATETOPICS;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.CHT_TEMPLATE == CHT_TEMPLATE && other.CHT_CODE == CHT_CODE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return CHT_TEMPLATE.GetHashCode() ^ CHT_CODE.GetHashCode();
            }
        }
    }
}