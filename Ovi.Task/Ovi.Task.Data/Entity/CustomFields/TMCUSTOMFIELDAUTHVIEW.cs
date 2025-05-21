namespace Ovi.Task.Data.Entity.CustomFields
{
    public class TMCUSTOMFIELDAUTHVIEW
    {
        public virtual string CFA_ENTITY { get; set; }

        public virtual string CFA_TYPE { get; set; }

        public virtual string CFA_CODE { get; set; }

        public virtual string CFA_GROUP { get; set; }

        public virtual char CFA_OPTIONAL { get; set; }

        public virtual char CFA_REQUIRED { get; set; }

        public virtual char CFA_PROTECTED { get; set; }

        public virtual char CFA_HIDDEN { get; set; }

        public virtual char CFA_VAL { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMCUSTOMFIELDAUTHVIEW;

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
    }
}