using System;

namespace Ovi.Task.Data.Entity
{
    public class TMDAYSVIEW
    {
        public virtual int TMD_YEAR { get; set; }

        public virtual int TMD_WEEK { get; set; }

        public virtual DateTime TMD_FIRSTDAY { get; set; }

        public virtual DateTime TMD_LASTDAY { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMDAYSVIEW;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TMD_YEAR == TMD_YEAR && other.TMD_WEEK == TMD_WEEK;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return TMD_YEAR.GetHashCode() ^ TMD_WEEK.GetHashCode();
            }
        }
    }
}