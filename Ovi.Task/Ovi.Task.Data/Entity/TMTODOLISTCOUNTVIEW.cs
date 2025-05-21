namespace Ovi.Task.Data.Entity
{
    public class TMTODOLISTCOUNTVIEW
    {
        public virtual string TOD_DEPARTMENT { get; set; }

        public virtual string TOD_CREATEDBY { get; set; }

        public virtual int? TOD_COUNT { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMTODOLISTCOUNTVIEW;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.TOD_DEPARTMENT == TOD_DEPARTMENT && other.TOD_CREATEDBY == TOD_CREATEDBY;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return TOD_DEPARTMENT.GetHashCode() ^ TOD_CREATEDBY.GetHashCode();
            }
        }
    }
}