namespace Ovi.Task.Data.Entity
{
    public class TMDESCRIPTIONS
    {
        public virtual string DES_CLASS { get; set; }

        public virtual string DES_PROPERTY { get; set; }

        public virtual string DES_CODE { get; set; }

        public virtual string DES_LANG { get; set; }

        public virtual string DES_TEXT { get; set; }

        public virtual int DES_RECORDVERSION { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMDESCRIPTIONS;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.DES_CLASS == DES_CLASS
                && other.DES_PROPERTY == DES_PROPERTY
                && other.DES_CODE == DES_CODE
                && other.DES_LANG == DES_LANG;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return DES_CLASS.GetHashCode() ^ DES_PROPERTY.GetHashCode() ^ DES_CODE.GetHashCode() ^
                       DES_LANG.GetHashCode();
            }
        }
    }
}