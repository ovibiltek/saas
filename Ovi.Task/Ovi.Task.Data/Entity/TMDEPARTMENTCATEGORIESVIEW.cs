namespace Ovi.Task.Data.Entity
{
    public class TMDEPARTMENTCATEGORIESVIEW
    {
        public virtual string CAT_CODE { get; set; }

        public virtual string CAT_DESC { get; set; }

        public virtual string CAT_DESCF { get; set; }

        public virtual string CAT_TSKTYPEREQUIRED { get; set; }

        public virtual string CAT_DEPARTMENT { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as TMDEPARTMENTCATEGORIESVIEW;

            if (ReferenceEquals(null, other))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return other.CAT_DEPARTMENT == CAT_DEPARTMENT && other.CAT_CODE == CAT_CODE;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return CAT_DEPARTMENT.GetHashCode() ^ CAT_CODE.GetHashCode();
            }
        }

    }
}