namespace Ovi.Task.Data.Entity
{
    public class TMMENU
    {
        public virtual string MNU_USERGROUP { get; set; }

        public virtual string MNU_SCREEN { get; set; }

        public virtual string MNU_SECURITYFILTER { get; set; }

        public virtual string MNU_SECURITYFILTERDESC { get; set; }

        public virtual char MNU_ACTIVE { get; set; }

        public virtual long MNU_SQLIDENTITY { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMMENU;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.MNU_USERGROUP == MNU_USERGROUP && other.MNU_SCREEN == MNU_SCREEN;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return MNU_USERGROUP.GetHashCode() ^ MNU_SCREEN.GetHashCode();
            }
        }
    }
}