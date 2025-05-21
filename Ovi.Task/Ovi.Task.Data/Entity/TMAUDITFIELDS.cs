namespace Ovi.Task.Data.Entity
{
    public class TMAUDITFIELDS
    {
        public virtual long AUF_ID { get; set; }

        public virtual string AUF_CLASS { get; set; }

        public virtual string AUF_PROPERTY { get; set; }

        public virtual char AUF_ISSECONDARYID { get; set; }

        public virtual char AUF_ACTIVE { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMAUDITFIELDS;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.AUF_CLASS == AUF_CLASS && other.AUF_PROPERTY == AUF_PROPERTY;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return AUF_CLASS.GetHashCode() ^ AUF_PROPERTY.GetHashCode();
            }
        }
    }
}